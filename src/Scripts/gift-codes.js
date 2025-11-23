/**
 * Gift code client: wires the UI form to the Vercel redemption endpoint.
 * The backend performs all signing/secret work; this script only formats data,
 * calls the public API, and gives the user clear feedback.
 */
(function initGiftCodeModule() {
  const GIFT_CODE_API_BASE = 'https://wos-forge.vercel.app';
  const GIFT_CODE_ENDPOINT = `${GIFT_CODE_API_BASE}/api/redeem`;
  const SUBMIT_COOLDOWN_MS = 4000;

  const state = {
    submitting: false,
    cooldownTimer: null,
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

  const redeemForPlayer = async ({ playerId, giftCode, note }) => {
    try {
      const response = await fetch(GIFT_CODE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerId,
          giftCode,
          note: note || undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      let payload;
      if (contentType.includes('application/json')) {
        payload = await response.json();
      } else {
        const text = await response.text();
        payload = text ? { message: text } : {};
      }

      const message = readMessage(
        payload,
        response.ok
          ? `Gift code sent to player ${playerId}`
          : `Request failed with status ${response.status}`
      );

      const waitSeconds = parseWaitSeconds(payload, response);
      const success =
        response.ok &&
        (payload?.success === undefined ||
          payload.success === true ||
          payload?.status === 'ok');

      return {
        success,
        message,
        waitSeconds,
        status: response.status,
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
    const form = document.getElementById('gift-code-form');
    if (!form) return;

    const singleField = document.getElementById('gift-player-id');
    const multiField = document.getElementById('gift-player-ids');
    const codeField = document.getElementById('gift-code-input');
    const noteField = document.getElementById('gift-note');
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

      if (!giftCode) {
        setStatusText(statusText, 'Enter the gift code you want to redeem.', 'warn');
        return;
      }

      if (!ids.length) {
        setStatusText(statusText, 'Add at least one player ID.', 'warn');
        return;
      }

      clearLog(logList);
      disableSubmit(submitButton);
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
        const result = await redeemForPlayer({ playerId, giftCode, note });
        if (result.success) {
          successCount += 1;
          pushLogEntry(logList, `[OK] Gift code sent to ${playerId}`, 'success');
          continue;
        }

        errorCount += 1;
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
    });
  });
})();
