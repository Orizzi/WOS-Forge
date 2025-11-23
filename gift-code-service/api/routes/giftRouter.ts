import express, { Request, Response } from 'express';
import crypto, { BinaryLike } from "crypto";
import axios, { AxiosError } from "axios";
import { sql } from '@vercel/postgres';
const router = express.Router();
const hash = "tB87#kPtkxqOS2";
const allowedStateMin = Number(process.env.ALLOWED_STATE_MIN ?? '1');
const allowedStateMax = Number(process.env.ALLOWED_STATE_MAX ?? '4000');

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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
  params.append(
    "sign",
    md5(
      `cdk=${giftCode.toString()}&fid=${fid.toString()}&time=${time.toString()}${hash}`
    )
  );
  params.append("fid", fid.toString());
  params.append("time", time.toString());
  params.append("cdk", giftCode.toString());
  if (captchaCode) {
    params.append("captcha_code", captchaCode.toString());
  }

  const response = await axios.post(
    "https://wos-giftcode-api.centurygame.com/api/gift_code",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data;
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
    console.error('Error in /add/:playerId', error);
    res.status(500).send('Internal server error.');
  }
});

router.get('/send/:giftCode', async (req: Request, res: Response) => {
  const giftCode = req.params.giftCode;
  const captchaFromQuery = req.query.captcha?.toString();
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
        const descr =
          mapped?.descr ||
          giftResponse?.msg ||
          giftResponse?.message ||
          'Unknown response from gift code API';

        // Captcha required/invalid -> fetch captcha image and return for manual solving
        if (errCode === 40101 || errCode === 40103) {
          let captchaImg: string | undefined;
          try {
            const captcha = await getCaptcha(row.player_id);
            captchaImg = captcha?.data?.captcha;
          } catch (captchaErr) {
            console.error('Captcha fetch failed', captchaErr);
          }

          const message = captchaImg
            ? `${descr} (captcha provided in response as base64)`
            : `${descr} (captcha image unavailable)`;

          response.push({
            playerId: row.player_id,
            playerName: row.player_name,
            message,
            code: giftCode,
            errCode,
            captchaImg,
          });

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
      } catch (e) {
        const error = e as AxiosError;
        switch (error.response?.status) {
          case 429: //Too Many Requests
            const ratelimitReset = error?.response?.headers['x-ratelimit-reset'];
            console.log(`Request at ${new Date()}`);
            console.log(`Reseted at ${resetAt}`);
            resetAt = new Date(ratelimitReset * 1000);
            tooManyAttempts = true;
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
            break;
        }
        const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000); //time in seconds
        await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
      }
    }
    else{
      const resetIn = Math.floor(( resetAt.getTime() - new Date().getTime()) / 1000); //time in seconds
      await sql`UPDATE Players SET last_message = ${`Too many attempts: Retry in ${resetIn} seconds(${resetAt.toLocaleTimeString()})`} WHERE player_id = ${row.player_id}`;
    }
  }
  if (cdkNotFound === false) {
    res.send(response);
  }
});

export default router;
