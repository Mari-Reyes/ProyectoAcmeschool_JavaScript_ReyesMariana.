/**
 * Componente: src/componets/exam-timer.js
 * Gestiona el cronómetro regresivo de exámenes, el formateo Hr:Min:Seg,
 * el tiempo final al terminar la prueba y la edición validada con tooltips.
 */

export function padTwoDigits(value) {
  const num = Math.max(0, Math.floor(Number(value) || 0));
  return String(num).padStart(2, '0');
}

export function splitSecondsToHMS(totalSeconds) {
  const safeSec = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hours = Math.floor(safeSec / 3600);
  const minutes = Math.floor((safeSec % 3600) / 60);
  const seconds = safeSec % 60;
  return { hours, minutes, seconds };
}

export function hmsToTotalSeconds(hours, minutes, seconds) {
  const h = Math.max(0, Math.min(24, Math.floor(Number(hours) || 0)));
  const m = Math.max(0, Math.min(59, Math.floor(Number(minutes) || 0)));
  const s = Math.max(0, Math.min(59, Math.floor(Number(seconds) || 0)));
  return h * 3600 + m * 60 + s;
}

export function formatHMS(totalSeconds) {
  const { hours, minutes, seconds } = splitSecondsToHMS(totalSeconds);
  return {
    hr: padTwoDigits(hours),
    min: padTwoDigits(minutes),
    sec: padTwoDigits(seconds),
    text: `${padTwoDigits(hours)}:${padTwoDigits(minutes)}:${padTwoDigits(seconds)}`
  };
}

/**
 * Renderiza horas, minutos y segundos en los elementos indicados.
 */
export function renderTimerDisplay(totalSeconds, selectors = {}) {
  const { hr, min, sec } = formatHMS(totalSeconds);
  const {
    hrSelector = '#timer-hr',
    minSelector = '#timer-min',
    secSelector = '#timer-sec'
  } = selectors;

  const hrEl = document.querySelector(hrSelector);
  const minEl = document.querySelector(minSelector);
  const secEl = document.querySelector(secSelector);

  if (hrEl) hrEl.textContent = hr;
  if (minEl) minEl.textContent = min;
  if (secEl) secEl.textContent = sec;
}

/**
 * Cronómetro regresivo para la realización del examen por parte del estudiante.
 */
export class ExamCountdownTimer {
  constructor({
    initialSeconds = 1800,
    selectors = {},
    onTick = null,
    onTimeExpired = null
  } = {}) {
    this.remainingSeconds = Math.max(0, Math.floor(Number(initialSeconds) || 0));
    this.selectors = selectors;
    this.onTick = onTick;
    this.onTimeExpired = onTimeExpired;
    this.intervalId = null;
    this.isRunning = false;
  }

  start() {
    if (this.isRunning || this.remainingSeconds <= 0) {
      renderTimerDisplay(this.remainingSeconds, this.selectors);
      return;
    }

    this.isRunning = true;
    renderTimerDisplay(this.remainingSeconds, this.selectors);

    this.intervalId = window.setInterval(() => {
      if (this.remainingSeconds > 0) {
        this.remainingSeconds -= 1;
        renderTimerDisplay(this.remainingSeconds, this.selectors);

        if (typeof this.onTick === 'function') {
          this.onTick(this.remainingSeconds, formatHMS(this.remainingSeconds));
        }
      }

      if (this.remainingSeconds <= 0) {
        this.stop();
        if (typeof this.onTimeExpired === 'function') {
          this.onTimeExpired(this.getSnapshot());
        }
      }
    }, 1000);
  }

  stop() {
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
  }

  getRemainingSeconds() {
    return Math.max(0, this.remainingSeconds);
  }

  getSnapshot() {
    const formatted = formatHMS(this.remainingSeconds);
    return {
      remainingSeconds: this.getRemainingSeconds(),
      ...formatted
    };
  }
}

/**
 * Sanitiza y valida el valor de una casilla del editor de tiempo (Hr: 0-24, Min: 0-59, Seg: 0-59).
 * Bloquea letras/caracteres no numéricos y limita el rango numérico.
 */
export function sanitizeTimerUnitValue(rawValue, unitType = 'minutes', padOnBlur = false) {
  const digitsOnly = String(rawValue ?? '').replace(/\D+/g, '').slice(0, 2);
  if (!digitsOnly) {
    return padOnBlur ? '00' : '';
  }

  const maxAllowed = unitType === 'hours' ? 24 : 59;
  let numeric = parseInt(digitsOnly, 10);
  if (Number.isNaN(numeric) || numeric < 0) numeric = 0;
  if (numeric > maxAllowed) numeric = maxAllowed;

  return padOnBlur ? padTwoDigits(numeric) : String(numeric);
}

/**
 * Inicializa las 3 casillas editables de tiempo (Hr, Min, Seg) en "Modificar examen",
 * con sus validaciones de rango y tooltips al pasar el mouse o presionar/enfocar.
 */
export function initEditableTimerControls({
  hrInputId = 'edit-timer-hr',
  minInputId = 'edit-timer-min',
  secInputId = 'edit-timer-sec',
  onChange = null
} = {}) {
  const hrInput = document.getElementById(hrInputId);
  const minInput = document.getElementById(minInputId);
  const secInput = document.getElementById(secInputId);

  const configs = [
    { input: hrInput, unit: 'hours' },
    { input: minInput, unit: 'minutes' },
    { input: secInput, unit: 'seconds' }
  ].filter((item) => Boolean(item.input));

  const getTooltipFor = (inputEl) => {
    const host = inputEl.closest('.tooltip-host');
    const targetId = host?.dataset?.tooltipTarget;
    return targetId ? document.getElementById(targetId) : host?.querySelector('.tooltip-box') ?? null;
  };

  const showTooltip = (inputEl) => {
    const tooltip = getTooltipFor(inputEl);
    if (tooltip) tooltip.classList.remove('is-hidden');
  };

  const hideTooltip = (inputEl) => {
    const tooltip = getTooltipFor(inputEl);
    if (tooltip) tooltip.classList.add('is-hidden');
  };

  const emitChange = () => {
    if (typeof onChange !== 'function') return;
    const hours = parseInt(sanitizeTimerUnitValue(hrInput?.value ?? '00', 'hours', true), 10) || 0;
    const minutes = parseInt(sanitizeTimerUnitValue(minInput?.value ?? '00', 'minutes', true), 10) || 0;
    const seconds = parseInt(sanitizeTimerUnitValue(secInput?.value ?? '00', 'seconds', true), 10) || 0;
    const totalSeconds = hmsToTotalSeconds(hours, minutes, seconds);

    onChange({
      hours,
      minutes,
      seconds,
      totalSeconds,
      formatted: formatHMS(totalSeconds)
    });
  };

  configs.forEach(({ input, unit }) => {
    input.addEventListener('mouseenter', () => showTooltip(input));
    input.addEventListener('focus', () => showTooltip(input));
    input.addEventListener('click', () => showTooltip(input));

    input.addEventListener('mouseleave', () => {
      if (document.activeElement !== input) {
        hideTooltip(input);
      }
    });

    input.addEventListener('input', () => {
      const sanitized = sanitizeTimerUnitValue(input.value, unit, false);
      if (input.value !== sanitized) {
        input.value = sanitized;
      }
      emitChange();
    });

    input.addEventListener('blur', () => {
      input.value = sanitizeTimerUnitValue(input.value, unit, true);
      hideTooltip(input);
      emitChange();
    });
  });

  return {
    setDurationSeconds(totalSeconds) {
      const { hr, min, sec } = formatHMS(totalSeconds);
      if (hrInput) hrInput.value = hr;
      if (minInput) minInput.value = min;
      if (secInput) secInput.value = sec;
    },
    getDurationSeconds() {
      const h = parseInt(sanitizeTimerUnitValue(hrInput?.value ?? '00', 'hours', true), 10) || 0;
      const m = parseInt(sanitizeTimerUnitValue(minInput?.value ?? '00', 'minutes', true), 10) || 0;
      const s = parseInt(sanitizeTimerUnitValue(secInput?.value ?? '00', 'seconds', true), 10) || 0;
      return hmsToTotalSeconds(h, m, s);
    }
  };
}
