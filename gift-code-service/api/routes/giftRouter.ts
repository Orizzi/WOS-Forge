import express, { Request, Response } from 'express';
import crypto, { BinaryLike, randomUUID } from "crypto";
import axios, { AxiosError } from "axios";
import { sql } from '@vercel/postgres';
const router = express.Router();
const hash = "tB87#kPtkxqOS2";
const allowedStateMin = Number(process.env.ALLOWED_STATE_MIN ?? '1');
const allowedStateMax = Number(process.env.ALLOWED_STATE_MAX ?? '4000');
const defaultHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  Accept: "application/json, text/plain, */*",
  Origin: "https://wos-giftcode.centurygame.com",
  Referer: "https://wos-giftcode.centurygame.com/",
  "Content-Type": "application/x-www-form-urlencoded",
};

type WosResponseData = {

}

type signInResponse = {
  data: {
    fid: Number,
    nickname: string,
    kid: Number,
    stove_lv: Number,
    stove_lv_content: Number,
    avatar_image: String
  },
  'x-ratelimit-remaining': Number
}

type CaptchaResponse = {
  data?: {
    captcha?: string;
  };
};

type WosResponse = {
  code: Number,
  data: [] | WosResponseData,
  msg: String;
  err_code: Number;
}

type msgKey = keyof typeof msg;
const msg = {
  40007: {
    code: 1,
    msg: "TIME ERROR.",
    err_code: 40007,
    descr: "Gift code expired.",
  },
  40004: {
    code: 1,
    msg: "RETRY LATER",
    err_code: 40004,
    descr: "System busy, retry shortly.",
  },
  40005: {
    code: 1,
    msg: "INVALID CAPTCHA",
    err_code: 40005,
    descr: "Captcha invalid, retry with a new captcha.",
  },
  40014: {
    code: 1,
    msg: "CDK NOT FOUND.",
    err_code: 40014,
    descr: "Gift code does not exist.",
  },
  40008: {
    code: 1,
    msg: "RECEIVED.",
    err_code: 40008,
    descr: "Gift code already used.",
  },
  40010: {
    code: 0,
    msg: "SUCCESS",
    err_code: 20000,
    descr: "Gift code send.",
  },
  40101: {
    code: 1,
    msg: "CAPTCHA REQUIRED",
    err_code: 40101,
    descr: "Captcha required, solve and retry.",
  },
  40103: {
    code: 1,
    msg: "CAPTCHA INVALID",
    err_code: 40103,
    descr: "Captcha invalid, try again.",
  },
};

/**
 * 
 * @param text Text to convert to MD5
 * @returns 
 */
const md5 = (text: BinaryLike) => {
  return crypto.createHash("md5").update(text).digest("hex");
};

/**
 * 
 * @param Player ID
 * @returns 
 */
const signIn = async (fid: number): Promise<signInResponse> => {
  const time = new Date().getTime();
  const params = new URLSearchParams();
  params.append(
    "sign",
    md5(`fid=${fid.toString()}&time=${time.toString()}${hash}`)
  );
  params.append("fid", fid.toString());
  params.append("time", time.toString());

  const response = await axios.post(
    "https://wos-giftcode-api.centurygame.com/api/player",
    params,
    {
      headers: defaultHeaders,
    }
  );
  return {
    data: response.data.data,
    "x-ratelimit-remaining": parseInt(response.headers["x-ratelimit-remaining"]) | 0,
  };
};

/**
 * Fetch captcha image (base64) for a player.
 */
const getCaptcha = async (fid: number): Promise<CaptchaResponse> => {
  const time = new Date().getTime();
  const params = new URLSearchParams();
  params.append(
    "sign",
    md5(`fid=${fid.toString()}&init=0&time=${time.toString()}${hash}`)
  );
  params.append("fid", fid.toString());
  params.append("time", time.toString());
  params.append("init", "0");

  const response = await axios.post(
    "https://wos-giftcode-api.centurygame.com/api/captcha",
    params,
    {
      headers: defaultHeaders,
    }
  );
  return response.data as CaptchaResponse;
};

/**
 * 
 * @param fid Player ID
 * @param giftCode Gift code
 * @returns 
 */
const sendGiftCode = async (fid: Number, giftCode: String, captchaCode?: string) => {
  const time = new Date().getTime();
  const params = new URLSearchParams();
  params.append("fid", fid.toString());
  params.append("time", time.toString());
  params.append("cdk", giftCode.toString());
  if (captchaCode) {
    params.append("captcha_code", captchaCode.toString());
  }

  // The upstream API has recently started returning PARAMERROR unless a captcha is present.
  // The safest option seen in other tools is to include captcha_code in the signature when provided.
  const signPayload = captchaCode
    ? `cdk=${giftCode.toString()}&fid=${fid.toString()}&captcha_code=${captchaCode.toString()}&time=${time.toString()}${hash}`
    : `cdk=${giftCode.toString()}&fid=${fid.toString()}&time=${time.toString()}${hash}`;
  params.append("sign", md5(signPayload));

  const response = await axios.post(
    "https://wos-giftcode-api.centurygame.com/api/gift_code",
    params,
    {
      headers: defaultHeaders,
    }
  );
  return response.data;
};

/**
 * Persist a successful redemption for audit/debug.
 * Creates the table on first use if missing.
 */
const logRedeemSuccess = async (playerId: Number, playerName: String, giftCode: String, message: String) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS redeems (
        id SERIAL PRIMARY KEY,
        player_id varchar(255),
        player_name varchar(255),
        code varchar(255),
        message text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      INSERT INTO redeems (player_id, player_name, code, message)
      VALUES (${playerId.toString()}, ${playerName.toString()}, ${giftCode.toString()}, ${message.toString()});
    `;
  } catch (err) {
    console.error('Failed to log redeem', err);
  }
};

/**
 * Log any redemption attempt (success, error, captcha, rate, etc.)
 */
const logRedeemAttempt = async (requestId: string, playerId: Number, playerName: String, giftCode: String, status: String, message: String, errCode?: Number | String) => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS redeem_logs (
        id SERIAL PRIMARY KEY,
        request_id varchar(64),
        player_id varchar(255),
        player_name varchar(255),
        code varchar(255),
        status varchar(32),
        err_code varchar(32),
        message text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      INSERT INTO redeem_logs (request_id, player_id, player_name, code, status, err_code, message)
      VALUES (${requestId}, ${playerId.toString()}, ${playerName.toString()}, ${giftCode.toString()}, ${status.toString()}, ${errCode ? errCode.toString() : null}, ${message.toString()});
    `;
  } catch (err) {
    console.error('Failed to log redeem attempt', err);
  }
};

router.get('/', async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.write(`<!DOCTYPE html> <html lang="en"> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <title>State 245: Rewards</title> </head> <body>`)
  res.write('<h1>State 245 rewards: Available pages</h1>')
  res.write('- Database players <a href="/players">/players</a><br/>')
  res.write('- Send a reward <a href="/send/giftcode">/send/[giftcode]</a><br/>')
  res.write('- Add a player <a href="/add/playerId">/add/[playerId]</a><br/>')
  res.write('- Remove a player <a href="/remove/playerId">/remove/[playerId]</a><br/>')
  res.write('<br/><u>Note:</u> The website wos-giftcode-api.centurygame.com has a rate limit of 30 calls by minutes. So maybe the request must be sent several times. Just wait to execute it again.<br/>')
  res.write('<br/><a href="https://github.com/Nico31300/wos-245-gift-rewards">Github repository</a>')
  res.write(`</body> </html>`)
  res.end();
});


router.get('/initDb', async (req: Request, res: Response) => {
  try {
    const result = await sql`CREATE TABLE players ( player_id varchar(255), player_name varchar(255), last_message varchar(255) );`;
    res.send(result)
  } catch (error) {
    res.json(error);
  }
});

router.get('/players', async (req: Request, res: Response) => {
  const { rows } = await sql`SELECT * FROM Players ORDER BY player_id;`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    res.write(`${row.player_name}(${row.player_id}): ${row.last_message} <br/>`)
  }
  res.end()
});

/**
 * Fetch a captcha image for a given player ID (base64).
 * Useful when the API responds with PARAMERROR/captcha required and the auto-fetch failed.
 */
router.get('/captcha/:playerId', async (req: Request, res: Response) => {
  const playerIdRaw = req.params.playerId;
  const playerId = Number(playerIdRaw);
  try {
    const captcha = await getCaptcha(playerId);
    if (captcha?.data?.captcha) {
      res.json({ playerId, captchaImg: captcha.data.captcha });
    } else {
      res.status(502).json({ playerId, error: 'Captcha unavailable from upstream' });
    }
  } catch (error) {
    console.error('Error fetching captcha', error);
    res.status(500).json({ playerId, error: 'Failed to fetch captcha' });
  }
});

/**
 * Return live player details (nickname, kid/state, furnace level) for all players in DB.
 * This calls the official /player endpoint for each entry; avoid abusing rate limits.
 */
router.get('/players/details', async (req: Request, res: Response) => {
  const { rows } = await sql`SELECT * FROM Players ORDER BY player_id;`;
  const results: Array<{
    playerId: number;
    nickname?: string;
    kid?: number;
    stove?: number;
    stoveContent?: number;
    err?: string;
  }> = [];

  for (const row of rows) {
    const playerId = Number(row.player_id);
    try {
      const info = await signIn(playerId);
      results.push({
        playerId,
        nickname: info.data?.nickname as string | undefined,
        kid: info.data?.kid as number | undefined,
        stove: info.data?.stove_lv as number | undefined,
        stoveContent: info.data?.stove_lv_content as number | undefined,
      });
    } catch (e) {
      const err = e as AxiosError;
      const errData = (err?.response?.data ?? {}) as Record<string, unknown>;
      const msgText =
        (typeof errData.message === 'string' && errData.message) ||
        (typeof errData.msg === 'string' && errData.msg) ||
        (err?.message ?? 'Unknown error');
      results.push({
        playerId,
        err: msgText,
      });
    }
  }

  res.json(results);
});

router.get('/remove/:playerId', async (req: Request, res: Response) => {
  const playerId = req.params.playerId;
  await sql`DELETE FROM players WHERE player_id = ${playerId}`;
  res.send(`Player removed from database`)
});

router.get('/add/:playerId', async (req: Request, res: Response) => {
  const playerIdRaw = req.params.playerId;
  const playerId = Number(playerIdRaw);

  try {
    const signInResponse = await signIn(playerId);
    const { kid, nickname } = signInResponse.data ?? {};

    console.log('Add player', {
      playerId,
      nickname,
      kid,
      allowedStateMin,
      allowedStateMax,
    });

    if (
      typeof kid === 'number' &&
      kid >= allowedStateMin &&
      kid <= allowedStateMax
    ) {
      await sql`INSERT INTO players (player_id, player_name, last_message) VALUES (${playerId}, ${nickname}, 'Created');`;
      res.status(200).send(`Player ${nickname} inserted into database`);
      return;
    }

    res
      .status(403)
      .send(`Player state ${kid} not allowed. Only states ${allowedStateMin}-${allowedStateMax} are allowed.`);
  } catch (error) {
    const err = error as AxiosError;
    const errData = (err?.response?.data ?? {}) as Record<string, unknown>;
    const msgText =
      (typeof errData.message === 'string' && errData.message) ||
      (typeof errData.msg === 'string' && errData.msg) ||
      err?.message ||
      'Internal server error.';
    const status = err?.response?.status ?? 500;
    console.error('Error in /add/:playerId', status, msgText, errData);
    res.status(status).send(msgText);
  }
});

router.get('/send/:giftCode', async (req: Request, res: Response) => {
  const giftCode = req.params.giftCode;
  const captchaFromQuery = req.query.captcha?.toString();
  const requestId = randomUUID ? randomUUID() : crypto.randomBytes(16).toString('hex');
  type APIResponse = {
    playerId: Number;
    playerName: String;
    message: String;
    code: String;
    errCode?: Number | String;
    captchaImg?: string;
  }
  let response: APIResponse[] = [];
  let resetAt: Date = new Date();
  const { rows } = await sql`SELECT * FROM players where last_message not like ${`%${giftCode}%`} or last_message is null ORDER BY player_id`;

  let cdkNotFound = false;
  let tooManyAttempts = false;

  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    if (!tooManyAttempts) {
      try {
        const signInResponse = await signIn(row.player_id)
        if (signInResponse.data.nickname !== row.player_name) {
          await sql`UPDATE players SET player_name = ${signInResponse.data.nickname } WHERE WHERE player_id = ${row.player_id.toString()};`
        }
        const giftResponse = await sendGiftCode(row.player_id, giftCode, captchaFromQuery)
        const mapped = msg[giftResponse.err_code as msgKey];
        const errCode = giftResponse.err_code;
        const rawMsg =
          (typeof giftResponse.msg === 'string' && giftResponse.msg) || '';
        const descr =
          mapped?.descr ||
          rawMsg ||
          giftResponse?.message ||
          'Unknown response from gift code API';

        // Captcha required/invalid (new upstream behaviour sometimes returns err_code 0 + "params error")
        const looksLikeCaptchaRequired =
          errCode === 40101 ||
          errCode === 40103 ||
          (errCode === 0 && /param/i.test(rawMsg));

        if (looksLikeCaptchaRequired) {
          let captchaImg: string | undefined;
          try {
            const captcha = await getCaptcha(row.player_id);
            captchaImg = captcha?.data?.captcha;
          } catch (captchaErr) {
            console.error('Captcha fetch failed', captchaErr);
          }

          const message = captchaImg
            ? `${descr} (captcha provided in response as base64)`
            : `${descr} (captcha image unavailable, try GET /captcha/${row.player_id})`;

          response.push({
            playerId: row.player_id,
            playerName: row.player_name,
            message,
            code: giftCode,
            errCode,
            captchaImg,
          });

          await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'captcha', message, errCode);

          await sql`UPDATE Players SET last_message = ${`${giftCode}: ${message}`} WHERE player_id = ${row.player_id}`;
          continue;
        }

        // If code doesn't exist or expired, stop and return immediately
        if (errCode === 40014 || errCode === 40007) {
          cdkNotFound = true;
          res.status(400).send({
            playerId: row.player_id,
            playerName: row.player_name,
            code: giftCode,
            errCode,
            message: descr,
          })
          await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'error', descr, errCode);
          break;
        }

        response.push({
          playerId: row.player_id,
          playerName: row.player_name,
          message: descr,
          code: giftCode,
          errCode,
        })

        await sql`UPDATE Players SET last_message = ${`${giftCode}: ${descr}`} WHERE player_id = ${row.player_id}`;

        // Log successful redemption for traceability
        if (errCode === 20000 || mapped?.code === 0) {
          await logRedeemSuccess(row.player_id, row.player_name, giftCode, descr);
          await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'success', descr, errCode);
        } else {
          await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'info', descr, errCode);
        }
      } catch (e) {
        const error = e as AxiosError;
        switch (error.response?.status) {
          case 429: //Too Many Requests
            const ratelimitReset = error?.response?.headers['x-ratelimit-reset'];
            console.log(`Request at ${new Date()}`);
            console.log(`Reseted at ${resetAt}`);
            resetAt = new Date(ratelimitReset * 1000);
            tooManyAttempts = true;
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'rate', 'Too many attempts', 429);
            break;
          default:
            console.log(e);
            const errData = error.response?.data as any;
            const status = error.response?.status;
            const serialized =
              typeof errData === 'string'
                ? errData
                : errData
                ? JSON.stringify(errData)
                : undefined;
            const msgText =
              errData?.msg ||
              errData?.message ||
              errData?.error ||
              serialized ||
              'Unknown error while sending gift code';
            response.push({
              playerId: row.player_id,
              playerName: row.player_name,
              message: status ? `[${status}] ${msgText}` : msgText,
              code: giftCode,
              errCode: status ?? errData?.err_code,
            });
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'error', msgText, status ?? errData?.err_code);
            break;
        }
        const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000); //time in seconds
        await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
      }
    }
    else{
      const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000); //time in seconds
      await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
      await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'rate', `Too many attempts: Retry in ${resetIn} seconds`, 429);
    }
  }
  if (cdkNotFound === false) {
    res.send(response);
  }
});

/**
 * Fetch recent redeem logs for inspection.
 * Optional query param ?limit=50 to adjust count.
 */
router.get('/logs/redeem', async (req: Request, res: Response) => {
  const limitRaw = req.query.limit?.toString();
  const limit = Math.min(Math.max(parseInt(limitRaw || '50', 10) || 50, 1), 500);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS redeem_logs (
        id SERIAL PRIMARY KEY,
        request_id varchar(64),
        player_id varchar(255),
        player_name varchar(255),
        code varchar(255),
        status varchar(32),
        err_code varchar(32),
        message text,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    const { rows } = await sql`
      SELECT request_id, player_id, player_name, code, status, err_code, message, created_at
      FROM redeem_logs
      ORDER BY created_at DESC
      LIMIT ${limit};
    `;
    res.json(rows);
  } catch (error) {
    console.error('Error fetching redeem logs', error);
    res.status(500).send('Failed to fetch logs');
  }
});

/**
 * Fire-and-forget redemption: responds immediately and continues processing in background.
 * Results are logged to the redeem_logs table.
 */
router.get('/send_async/:giftCode', async (req: Request, res: Response) => {
  const giftCode = req.params.giftCode;
  const captchaFromQuery = req.query.captcha?.toString();
  const requestId = randomUUID ? randomUUID() : crypto.randomBytes(16).toString('hex');

  res.status(202).json({ requestId, status: 'accepted', message: 'Redemption started in background' });

  setImmediate(async () => {
    let resetAt: Date = new Date();
    const { rows } = await sql`SELECT * FROM players where last_message not like ${`%${giftCode}%`} or last_message is null ORDER BY player_id`;

    let cdkNotFound = false;
    let tooManyAttempts = false;

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      if (!tooManyAttempts) {
        try {
          const signInResponse = await signIn(row.player_id)
          if (signInResponse.data.nickname !== row.player_name) {
            await sql`UPDATE players SET player_name = ${signInResponse.data.nickname } WHERE WHERE player_id = ${row.player_id.toString()};`
          }
          const giftResponse = await sendGiftCode(row.player_id, giftCode, captchaFromQuery)
          const mapped = msg[giftResponse.err_code as msgKey];
          const errCode = giftResponse.err_code;
          const rawMsg =
            (typeof giftResponse.msg === 'string' && giftResponse.msg) || '';
          const descr =
            mapped?.descr ||
            rawMsg ||
            giftResponse?.message ||
            'Unknown response from gift code API';

          const looksLikeCaptchaRequired =
            errCode === 40101 ||
            errCode === 40103 ||
            (errCode === 0 && /param/i.test(rawMsg));

          if (looksLikeCaptchaRequired) {
            let captchaImg: string | undefined;
            try {
              const captcha = await getCaptcha(row.player_id);
              captchaImg = captcha?.data?.captcha;
            } catch (captchaErr) {
              console.error('Captcha fetch failed', captchaErr);
            }

            const message = captchaImg
              ? `${descr} (captcha provided in response as base64)`
              : `${descr} (captcha image unavailable, try GET /captcha/${row.player_id})`;

            await sql`UPDATE Players SET last_message = ${`${giftCode}: ${message}`} WHERE player_id = ${row.player_id}`;
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'captcha', message, errCode);
            continue;
          }

          if (errCode === 40014 || errCode === 40007) {
            cdkNotFound = true;
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'error', descr, errCode);
            break;
          }

          await sql`UPDATE Players SET last_message = ${`${giftCode}: ${descr}`} WHERE player_id = ${row.player_id}`;

          if (errCode === 20000 || mapped?.code === 0) {
            await logRedeemSuccess(row.player_id, row.player_name, giftCode, descr);
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'success', descr, errCode);
          } else {
            await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'info', descr, errCode);
          }
        } catch (e) {
          const error = e as AxiosError;
          switch (error.response?.status) {
            case 429:
              const ratelimitReset = error?.response?.headers['x-ratelimit-reset'];
              resetAt = new Date(ratelimitReset * 1000);
              tooManyAttempts = true;
              await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'rate', 'Too many attempts', 429);
              break;
            default:
              const errData = error.response?.data as any;
              const status = error.response?.status;
              const serialized =
                typeof errData === 'string'
                  ? errData
                  : errData
                  ? JSON.stringify(errData)
                  : undefined;
              const msgText =
                errData?.msg ||
                errData?.message ||
                errData?.error ||
                serialized ||
                'Unknown error while sending gift code';
              await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'error', msgText, status ?? errData?.err_code);
              break;
          }
          const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000);
          await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
        }
      }
      else{
        const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000); //time in seconds
        await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
        await logRedeemAttempt(requestId, row.player_id, row.player_name, giftCode, 'rate', `Too many attempts: Retry in ${resetIn} seconds`, 429);
      }
    }
  });
});

export default router;
