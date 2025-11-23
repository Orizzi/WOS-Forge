const crypto = require('crypto');
const axios = require('axios');

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

const buildForm = (payload) => {
  const params = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    params.append(key, value);
  });
  return params;
};

const signIn = async (playerId) => {
  const time = Date.now();
  const payload = buildForm({
    sign: md5(`fid=${playerId}&time=${time}${HASH}`),
    fid: String(playerId),
    time: String(time),
  });

  const response = await axios.post(`${BASE_URL}/player`, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  return {
    info: response.data?.data ?? null,
    rateRemaining: Number(response.headers['x-ratelimit-remaining'] || 0),
    rateReset: response.headers['x-ratelimit-reset'],
  };
};

const sendGiftCode = async (playerId, giftCode) => {
  const time = Date.now();
  const payload = buildForm({
    sign: md5(`cdk=${giftCode}&fid=${playerId}&time=${time}${HASH}`),
    fid: String(playerId),
    time: String(time),
    cdk: giftCode,
  });

  const response = await axios.post(`${BASE_URL}/gift_code`, payload, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response;
};

const parseWaitSeconds = (headers = {}) => {
  const getHeader =
    typeof headers.get === 'function'
      ? (key) => headers.get(key)
      : (key) => headers[key?.toLowerCase()];

  const retryAfter = getHeader('retry-after');
  if (retryAfter && !Number.isNaN(Number(retryAfter))) {
    return Number(retryAfter);
  }
  const reset = getHeader('x-ratelimit-reset');
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
      } catch (error) {
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
    res.status(400).json({ message: 'playerId and giftCode are required' });
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

    try {
      const giftResponse = await sendGiftCode(playerId, giftCode);
      const data = giftResponse.data;
      const mapping = RESULT_MAP[data.err_code] || {
        descr: data?.msg || 'Unknown response',
        code: data?.code ?? 1,
        err_code: data?.err_code ?? -1,
      };
      const success = mapping.err_code === 20000;

      res.status(200).json({
        success,
        playerId,
        nickname: player.info.nickname,
        message: mapping.descr,
        note: note || undefined,
      });
      return;
    } catch (error) {
      if (error?.response?.status === 429) {
        res.status(429).json({
          message: 'Rate limit reached. Please wait before retrying.',
          wait: parseWaitSeconds(error.response.headers),
        });
        return;
      }
      if (error?.response?.data) {
        res.status(200).json({
          success: false,
          playerId,
          nickname: player.info.nickname,
          message:
            error.response.data?.msg ||
            error.response.data?.message ||
            'Gift-code service error',
        });
        return;
      }
      throw error;
    }
  } catch (error) {
    res.status(error.status || 500).json({
      message:
        typeof error?.message === 'string'
          ? error.message
          : 'Gift-code service error',
    });
  }
};
