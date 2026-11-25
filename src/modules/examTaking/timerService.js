/**
 * Servicio de temporizador: src/modules/examTaking/timerService.js
 * Controla el reloj regresivo en tiempo real (Hr : Min : Seg) durante la resolución
 * del examen y notifica cuando llega a cero.
 */

import {
  ExamCountdownTimer,
  formatHMS,
  renderTimerDisplay
} from '../../componets/exam-timer.js';

export const DEFAULT_TIMER_SELECTORS = Object.freeze({
  hrSelector: '#timer-hr, #countdown-hr',
  minSelector: '#timer-min, #countdown-min',
  secSelector: '#timer-sec, #countdown-sec'
});

/**
 * Renderiza el contador en los selectores activos del DOM (soporta tanto #timer-* como #countdown-*).
 */
export function renderRunnerTimer(totalSeconds, selectors = DEFAULT_TIMER_SELECTORS) {
  const { hr, min, sec } = formatHMS(totalSeconds);
  const safeSec = Math.max(0, Math.floor(Number(totalSeconds) || 0));

  // Si ya existen los selectores primarios, delegamos directamente al componente base
  if (
    document.querySelector('#timer-hr') ||
    document.querySelector('#timer-min') ||
    document.querySelector('#timer-sec')
  ) {
    renderTimerDisplay(safeSec, {
      hrSelector: '#timer-hr',
      minSelector: '#timer-min',
      secSelector: '#timer-sec'
    });
  }

  // Actualiza también los selectores alternativos si están presentes en la plantilla
  const altHr = document.querySelector('#countdown-hr');
  const altMin = document.querySelector('#countdown-min');
  const altSec = document.querySelector('#countdown-sec');

  if (altHr) altHr.textContent = hr;
  if (altMin) altMin.textContent = min;
  if (altSec) altSec.textContent = sec;

  if (selectors && selectors.customRender && typeof selectors.customRender === 'function') {
    selectors.customRender(safeSec, formatHMS(safeSec));
  }
}

/**
 * Controlador de temporizador para la sesión de examen del estudiante.
 */
export class ExamTimerController {
  constructor({
    initialSeconds = 1800,
    selectors = DEFAULT_TIMER_SELECTORS,
    onTick = null,
    onTimeout = null
  } = {}) {
    this.selectors = selectors;
    this.onTick = onTick;
    this.onTimeout = onTimeout;
    this.hasTimedOut = false;

    const startSec = Math.max(0, Math.floor(Number(initialSeconds) || 0));
    renderRunnerTimer(startSec, this.selectors);

    this.countdown = new ExamCountdownTimer({
      initialSeconds: startSec,
      selectors: {
        hrSelector: '#timer-hr',
        minSelector: '#timer-min',
        secSelector: '#timer-sec'
      },
      onTick: (remainingSeconds, formatted) => {
        renderRunnerTimer(remainingSeconds, this.selectors);
        if (typeof this.onTick === 'function') {
          this.onTick(remainingSeconds, formatted);
        }
      },
      onTimeExpired: (snapshot) => {
        if (this.hasTimedOut) return;
        this.hasTimedOut = true;
        renderRunnerTimer(0, this.selectors);
        if (typeof this.onTimeout === 'function') {
          this.onTimeout({
            ...snapshot,
            remainingSeconds: 0,
            ...formatHMS(0)
          });
        }
      }
    });
  }

  start() {
    this.countdown.start();
  }

  stop() {
    this.countdown.stop();
  }

  getRemainingSeconds() {
    return this.countdown.getRemainingSeconds();
  }

  getSnapshot() {
    return this.countdown.getSnapshot();
  }
}
