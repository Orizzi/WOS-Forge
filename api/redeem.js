const crypto = require('crypto');

const HASH = 'tB87#kPtkxqOS2';
const BASE_URL = 'https://wos-giftcode-api.centurygame.com/api';

const RESULT_MAP = {
  40007: {
    code: 1,
    msg: 'TIME ERROR.',
    err_code: 40007,
    descr: 'Gift code expired.',
  },
  40014: {
    code: 1,
    msg: 'CDK NOT FOUND.',
    err_code: 40014,
    descr: 'Gift code does not exist.',
  },
  40008: {
    code: 1,
    msg: 'RECEIVED.',
    err_code: 40008,
    descr: 'Gift code already used.',
  },
  40010: {
    code: 0,
    msg: 'SUCCESS',
    err_code: 20000,
    descr: 'Gift code sent.',
  },
};

const allowOrigin =
  process.env.GIFT_CODE_ALLOWED_ORIGIN ||
  process.env.ALLOWED_ORIGIN ||
  '*';

const addCors = (res) => {
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
};

const md5 = (text) => crypto.createHash('md5').update(text).digest('hex');

const toFormBody = (payload) => {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, value);
  });
  return params.toString();
};

const fetchJson = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const data = await response.json();
  return {
    status: response.status,
    headers: response.headers,
    data,
  };
};

const signIn = async (playerId) => {
  const time = Date.now();
  const payload = {
    sign: md5(`fid=${playerId}&time=${time}${HASH}`),
    fid: String(playerId),
    time: String(time),
  };

  const response = await fetchJson(`${BASE_URL}/player`, toFormBody(payload));
  if (response.status !== 200) {
    const error = new Error('Player lookup failed');
    error.status = response.status;
    error.payload = response.data;
    throw error;
  }
  return {
    info: response.data?.data ?? null,
    rateRemaining: Number(response.headers.get('x-ratelimit-remaining') || 0),
    rateReset: response.headers.get('x-ratelimit-reset'),
  };
};

const sendGiftCode = async (playerId, giftCode) => {
  const time = Date.now();
  const payload = {
    sign: md5(`cdk=${giftCode}&fid=${playerId}&time=${time}${HASH}`),
    fid: String(playerId),
    time: String(time),
    cdk: giftCode,
  };

  const response = await fetchJson(
    `${BASE_URL}/gift_code`,
    toFormBody(payload)
  );

  if (!response.data) {
    const error = new Error('Invalid response from gift-code API');
    error.status = response.status;
    throw error;
  }

  if (response.status === 429) {
    const rateError = new Error('Rate limit hit');
    rateError.status = 429;
    rateError.headers = response.headers;
    throw rateError;
  }

  return response.data;
};

const parseWaitSeconds = (headers) => {
  if (!headers) return undefined;
  const retryAfter = headers.get('retry-after');
  if (retryAfter && !Number.isNaN(Number(retryAfter))) {
    return Number(retryAfter);
  }
  const reset = headers.get('x-ratelimit-reset');
  if (reset && !Number.isNaN(Number(reset))) {
    const resetDate = Number(reset) * 1000;
    const diff = Math.ceil((resetDate - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }
  return undefined;
};

const readBody = async (req) => {
  if (req.body) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch (err) {
        return {};
      }
    }
    return req.body;
  }

  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch (error) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
};

module.exports = async function handler(req, res) {
  addCors(res);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = await readBody(req);
  } catch (error) {
    res.status(400).json({ message: 'Unable to read request body' });
    return;
  }
  const playerIdRaw = body.playerId ?? body.fid;
  const giftCodeRaw = body.giftCode ?? body.cdk;
  const note = body.note || '';

  if (!playerIdRaw || !giftCodeRaw) {
    res.status(400).json({
      message: 'playerId and giftCode are required',
    });
    return;
  }

  const playerId = Number(String(playerIdRaw).trim());
  const giftCode = String(giftCodeRaw).trim().toUpperCase();

  if (Number.isNaN(playerId) || playerId <= 0) {
    res.status(400).json({ message: 'playerId must be a positive number' });
    return;
  }

  if (!giftCode) {
    res.status(400).json({ message: 'giftCode must be provided' });
    return;
  }

  try {
    const player = await signIn(playerId);
    if (!player.info) {
      res.status(404).json({ message: 'Player not found' });
      return;
    }

    const result = await sendGiftCode(playerId, giftCode);
    const mapping = RESULT_MAP[result.err_code] || {
      descr: result?.msg || 'Unknown response',
      code: result?.code ?? 1,
      err_code: result?.err_code ?? -1,
    };
    const success = mapping.err_code === 20000;

    res.status(200).json({
      success,
      playerId,
      nickname: player.info.nickname,
      message: mapping.descr,
      note: note || undefined,
    });
  } catch (error) {
    if (error.status === 429) {
      res.status(429).json({
        message: 'Rate limit reached. Please wait before retrying.',
        wait: parseWaitSeconds(error.headers),
      });
      return;
    }

    res.status(500).json({
      message: 'Gift-code service error',
      detail:
        typeof error?.message === 'string'
          ? error.message
          : 'Unknown error occurred',
    });
  }
};
