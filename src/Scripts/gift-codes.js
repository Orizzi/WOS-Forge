/**
 * Gift code client: wires the UI form to the Vercel redemption endpoint.
 * The backend performs all signing/secret work; this script only formats data,
 * calls the public API, and gives the user clear feedback.
 */
(function initGiftCodeModule() {
  // Backend gift-code service (Vercel) that proxies official API calls
  // Use the stable alias instead of a per-deploy hash URL
  const BACKEND_BASE = 'https://wos-forge.vercel.app';
  const SUBMIT_COOLDOWN_MS = 4000;

  const state = {
    submitting: false,
    cooldownTimer: null,
    lastCaptchaImg: null,
    storedIds: new Set(),
    storedCodes: new Set(),
  };

  const STORAGE_KEYS = {
    ids: 'giftcode_ids',
    codes: 'giftcode_codes',
  };

  const loadStored = () => {
    try {
      const ids = JSON.parse(localStorage.getItem(STORAGE_KEYS.ids) || '[]');
      const codes = JSON.parse(localStorage.getItem(STORAGE_KEYS.codes) || '[]');
      state.storedIds = new Set(ids);
      state.storedCodes = new Set(codes);
    } catch (e) {
      state.storedIds = new Set();
      state.storedCodes = new Set();
    }
  };

  const persistStored = () => {
    localStorage.setItem(STORAGE_KEYS.ids, JSON.stringify([...state.storedIds]));
    localStorage.setItem(STORAGE_KEYS.codes, JSON.stringify([...state.storedCodes]));
  };

  const parseIds = (raw) =>
    raw
      .split(/[\s,]+/)
      .map((id) => id.trim())
      .filter(Boolean);

  const uniqueIds = (ids) => {
    const seen = new Set();
    return ids.filter((id) => {
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  };

  const formatId = (value) => value.trim().replace(/[^\dA-Za-z]/g, '');

  const setStatusText = (target, message, type = 'info') => {
    if (!target) return;
    target.textContent = message;
    target.dataset.status = type;
  };

  const pushLogEntry = (list, message, type = 'info') => {
    if (!list) return;
    const item = document.createElement('li');
    item.textContent = message;
    item.className = `gift-code-log__item ${type}`;
    list.prepend(item);
  };

  const clearLog = (list) => {
    if (list) list.innerHTML = '';
  };

  const disableSubmit = (button) => {
    if (!button) return;
    state.submitting = true;
    if (!button.dataset.originalLabel) {
      button.dataset.originalLabel = button.textContent;
    }
    button.disabled = true;
    button.textContent = 'Redeeming...';
  };

  const enableSubmit = (button) => {
    if (!button) return;
    button.disabled = false;
    button.textContent = button.dataset.originalLabel || 'Redeem';
    state.submitting = false;
  };

  const startCooldown = (button) => {
    if (!button) return;
    if (state.cooldownTimer) {
      window.clearTimeout(state.cooldownTimer);
    }
    button.disabled = true;
    state.cooldownTimer = window.setTimeout(() => {
      if (!state.submitting) {
        button.disabled = false;
      }
    }, SUBMIT_COOLDOWN_MS);
  };

  const readIdsFromForm = (singleField, multiField) => {
    const ids = [];
    if (singleField && singleField.value.trim()) {
      ids.push(singleField.value.trim());
    }
    if (multiField && multiField.value.trim()) {
      ids.push(...parseIds(multiField.value));
    }
    return uniqueIds(ids.map(formatId)).filter(Boolean);
  };

  const parseWaitSeconds = (payload, response) => {
    const wait =
      payload?.wait ??
      payload?.retryAfter ??
      payload?.retry_after ??
      (response?.headers?.get
        ? response.headers.get('retry-after')
        : undefined);
    return typeof wait === 'number' ? wait : wait ? Number(wait) : undefined;
  };

  const readMessage = (payload, fallback) =>
    payload?.message ||
    payload?.msg ||
    payload?.error ||
    fallback ||
    'Unknown response';

  const fetchCaptchaImage = async (playerId) => {
    try {
      const res = await fetch(`${BACKEND_BASE}/captcha/${playerId}`);
      if (!res.ok) return undefined;
      const data = await res.json();
      return data?.captchaImg;
    } catch (e) {
      return undefined;
    }
  };

  const redeemForPlayer = async ({ playerId, giftCode, note, captcha }) => {
    try {
      // Step 1: ensure player is in DB
      const addRes = await fetch(`${BACKEND_BASE}/add/${playerId}`);
      if (!addRes.ok) {
        const txt = await addRes.text();
        return {
          success: false,
          message: readMessage({ message: txt }, `Add failed (${addRes.status})`),
          status: addRes.status,
        };
      }

      // Step 2: send gift
      const url = new URL(`${BACKEND_BASE}/send/${giftCode}`);
      if (captcha) {
        url.searchParams.set('captcha', captcha);
      }
      const sendRes = await fetch(url.toString());
      const contentType = sendRes.headers.get('content-type') || '';
      let payload;
      if (contentType.includes('application/json')) {
        payload = await sendRes.json();
      } else {
        const text = await sendRes.text();
        payload = text ? { message: text } : {};
      }

      // payload is often an array of results; pick the first matching playerId if present
      let entry = Array.isArray(payload)
        ? payload.find((item) => `${item.playerId}` === `${playerId}`) || payload[0]
        : payload;

      const message = readMessage(
        entry,
        sendRes.ok
          ? `Gift code sent to player ${playerId}`
          : `Request failed with status ${sendRes.status}`
      );

      const waitSeconds = parseWaitSeconds(entry, sendRes);
      const errCode = entry?.errCode ?? entry?.err_code;
      const captchaImg = entry?.captchaImg;

      const success =
        sendRes.ok &&
        (errCode === undefined ||
          errCode === null ||
          errCode === 20000 ||
          entry?.success === true);

      return {
        success,
        message,
        waitSeconds,
        status: sendRes.status,
        errCode,
        captchaImg,
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadStored();
    const form = document.getElementById('gift-code-form');
    if (!form) return;

    const singleField = document.getElementById('gift-player-id');
    const multiField = document.getElementById('gift-player-ids');
    const codeField = document.getElementById('gift-code-input');
    const noteField = document.getElementById('gift-note');
    const captchaBlock = document.getElementById('gift-captcha-block');
    const captchaImg = document.getElementById('gift-captcha-img');
    const captchaInput = document.getElementById('gift-captcha-input');
    const statusText = document.querySelector('.gift-code-status-text');
    const logList = document.getElementById('gift-code-log');
    const submitButton = document.getElementById('gift-code-submit');

    if (!codeField || !submitButton) {
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (state.submitting) return;

      const ids = readIdsFromForm(singleField, multiField);
      const giftCode = codeField.value.trim().toUpperCase();
      const note = noteField?.value.trim() || '';
      const captchaCode = captchaInput?.value.trim() || '';

      if (!giftCode) {
        setStatusText(statusText, 'Enter the gift code you want to redeem.', 'warn');
        return;
      }

      if (!ids.length) {
        setStatusText(statusText, 'Add at least one player ID.', 'warn');
        return;
      }

      // Persist IDs and codes for future auto-runs
      ids.forEach((id) => state.storedIds.add(id));
      if (giftCode) state.storedCodes.add(giftCode);
      persistStored();

      clearLog(logList);
      disableSubmit(submitButton);
      // Keep captcha visible if the user provided one, otherwise hide until the API asks for it
      if (captchaBlock && !captchaCode) captchaBlock.hidden = true;
      setStatusText(
        statusText,
        `Redeeming ${giftCode} for ${ids.length} player(s)...`,
        'info'
      );

      let successCount = 0;
      let errorCount = 0;
      let aborted = false;

      for (let i = 0; i < ids.length; i += 1) {
        const playerId = ids[i];
        setStatusText(
          statusText,
          `Redeeming ${giftCode}: ${i + 1}/${ids.length} in progress...`,
          'info'
        );
        // eslint-disable-next-line no-await-in-loop
        const result = await redeemForPlayer({
          playerId,
          giftCode,
          note,
          captcha: captchaCode || undefined,
        });
        if (result.success) {
          successCount += 1;
          pushLogEntry(logList, `[OK] Gift code sent to ${playerId}`, 'success');
          continue;
        }

        errorCount += 1;
        if (result.captchaImg) {
          state.lastCaptchaImg = result.captchaImg;
          if (captchaImg) {
            captchaImg.src = `data:image/png;base64,${result.captchaImg}`;
          }
          if (captchaBlock) captchaBlock.hidden = false;
          if (captchaInput) {
            captchaInput.focus();
          }
          pushLogEntry(
            logList,
            `[CAPTCHA] ${playerId}: captcha required/invalid. Solve and resend.`,
            'warn'
          );
          setStatusText(
            statusText,
            'Captcha required. Solve the image and resend.',
            'warn'
          );
          break;
        }

        const needsCaptcha =
          result.errCode === 40101 ||
          result.errCode === 40103 ||
          result.errCode === 0 ||
          /captcha/i.test(result.message || '');
        if (needsCaptcha) {
          const fetchedImg = await fetchCaptchaImage(playerId);
          if (fetchedImg) {
            state.lastCaptchaImg = fetchedImg;
            if (captchaImg) {
              captchaImg.src = `data:image/png;base64,${fetchedImg}`;
            }
            if (captchaBlock) captchaBlock.hidden = false;
            if (captchaInput) {
              captchaInput.value = '';
              captchaInput.focus();
            }
            pushLogEntry(
              logList,
              `[CAPTCHA] ${playerId}: captcha required. Solve and resend.`,
              'warn'
            );
            setStatusText(
              statusText,
              'Captcha required. Solve the image and resend.',
              'warn'
            );
            aborted = true;
            break;
          }
        }

        const waitInfo =
          typeof result.waitSeconds === 'number'
            ? ` Please wait ${Math.ceil(result.waitSeconds)} seconds before retrying.`
            : '';
        const entryType =
          result.status === 429 || result.waitSeconds ? 'rate' : 'error';

        pushLogEntry(
          logList,
          `[ERR] ${playerId}: ${result.message}${waitInfo}`,
          entryType
        );

        if (entryType === 'rate') {
          aborted = true;
          setStatusText(
            statusText,
            result.message ||
              'Rate limit reached. Please wait a bit before trying again.',
            'warn'
          );
          break;
        }
      }

      if (!aborted) {
        const summary = `${successCount}/${ids.length} players redeemed. Errors: ${errorCount}.`;
        setStatusText(
          statusText,
          errorCount ? `${summary} Check the log for details.` : summary,
          errorCount ? 'warn' : 'success'
        );
      }

      enableSubmit(submitButton);
      startCooldown(submitButton);
    });

    form.addEventListener('reset', () => {
      clearLog(logList);
      setStatusText(
        statusText,
        'Provide at least one player ID and a gift code to redeem.',
        'info'
      );
      if (captchaBlock) captchaBlock.hidden = true;
      if (captchaImg) captchaImg.removeAttribute('src');
      if (captchaInput) captchaInput.value = '';
    });

    // Auto retry stored IDs/codes every minute, sequential, skip if already submitting
    const autoRedeem = async () => {
      if (state.submitting) return;
      if (!state.storedIds.size || !state.storedCodes.size) return;
      const ids = [...state.storedIds];
      const codes = [...state.storedCodes];
      setStatusText(
        statusText,
        `Auto-redeem: ${codes.length} code(s) x ${ids.length} ID(s)...`,
        'info'
      );
      for (const code of codes) {
        for (const id of ids) {
          // eslint-disable-next-line no-await-in-loop
          const result = await redeemForPlayer({ playerId: id, giftCode: code });
          if (result.success) {
            pushLogEntry(logList, `[AUTO OK] ${code} -> ${id}`, 'success');
            continue;
          }
          if (result.captchaImg || result.errCode === 40101 || result.errCode === 40103 || result.errCode === 0) {
            pushLogEntry(
              logList,
              `[AUTO STOP] ${code} -> ${id}: captcha required. Solve manually.`,
              'warn'
            );
            return;
          }
          if (result.status === 429 || result.waitSeconds) {
            pushLogEntry(
              logList,
              `[AUTO RATE] ${code} -> ${id}: ${result.message}`,
              'rate'
            );
            return;
          }
          pushLogEntry(
            logList,
            `[AUTO ERR] ${code} -> ${id}: ${result.message}`,
            'error'
          );
        }
      }
      setStatusText(statusText, 'Auto-redeem pass complete.', 'info');
    };

    setInterval(autoRedeem, 60 * 1000);
  });
})();
