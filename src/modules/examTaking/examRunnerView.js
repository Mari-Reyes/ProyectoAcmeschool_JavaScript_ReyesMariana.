/**
 * Vista: src/modules/examTaking/examRunnerView.js
 * Renderiza cada pregunta con sus 4 opciones de selección única, el aviso de
 * respuesta guardada y la pantalla de resultado del estudiante.
 */

import { splitSecondsToHMS, padTwoDigits } from '../../componets/exam-timer.js';

let savedToastTimeoutId = null;

/**
 * Muestra el aviso flotante no interactivo cuando el estudiante selecciona una opción.
 */
export function showAnswerSavedToast(message = '¡Se ha guardado tu respuesta con éxito!') {
  const toastEl = document.getElementById('toast-answer-saved');
  if (!toastEl) return;

  toastEl.textContent = message;
  toastEl.classList.remove('is-hidden');

  if (savedToastTimeoutId !== null) {
    window.clearTimeout(savedToastTimeoutId);
  }

  savedToastTimeoutId = window.setTimeout(() => {
    toastEl.classList.add('is-hidden');
    savedToastTimeoutId = null;
  }, 6000);
}

/**
 * Renderiza la pregunta activa y sus opciones de selección única.
 * @returns {number} Índice normalizado de la pregunta actual.
 */
export function renderQuestionStep({
  questions = [],
  currentIndex = 0,
  answers = {},
  onSelectOption = null
} = {}) {
  if (!Array.isArray(questions) || questions.length === 0) return 0;

  const container =
    document.getElementById('questions-container') ||
    document.getElementById('question-options-container');

  if (!container) return 0;

  container.innerHTML = '';

  questions.forEach((question, qIndex) => {
    const questionNumber = question.number ?? qIndex + 1;
    const questionTitle = question.title || `Pregunta ${questionNumber}`;

    const article = document.createElement('article');
    article.className = 'question-block';
    article.dataset.questionId = String(question.id ?? '');
    article.dataset.questionNumber = String(questionNumber);

    const heading = document.createElement('h2');
    heading.className = 'question-block__title';
    heading.textContent = questionTitle;

    const statement = document.createElement('div');
    statement.className = 'question-block__statement';
    statement.textContent = question.statement ?? '';

    const optionsGroup = document.createElement('div');
    optionsGroup.className = 'question-block__options';
    optionsGroup.setAttribute('role', 'radiogroup');
    optionsGroup.setAttribute('aria-label', `Opciones de ${questionTitle}`);

    const options = Array.isArray(question.options) ? question.options : [];
    const groupName = `question-${question.id ?? questionNumber}`;

    options.forEach((opt, optIdx) => {
      const optionValue = String(opt.id ?? optIdx);
      const isSelected = String(answers[question.id] ?? '') === optionValue;

      const label = document.createElement('label');
      label.className = isSelected
        ? 'answer-option exam-option-item is-selected'
        : 'answer-option exam-option-item';
      label.dataset.optionId = optionValue;
      label.dataset.optionIndex = String(optIdx);

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = groupName;
      radio.value = optionValue;
      radio.className = 'answer-option__radio';
      radio.checked = isSelected;

      radio.addEventListener('change', () => {
        showAnswerSavedToast('¡Se ha guardado tu respuesta con éxito!');
        if (typeof onSelectOption === 'function') {
          onSelectOption(question.id, opt.id ?? optionValue);
        }
      });

      const circle = document.createElement('span');
      circle.className = 'answer-option__circle';
      circle.setAttribute('aria-hidden', 'true');

      const textSpan = document.createElement('span');
      textSpan.className = 'answer-option__text exam-option-item__text';
      textSpan.textContent = opt.text ?? '';

      label.append(radio, circle, textSpan);
      optionsGroup.appendChild(label);
    });

    article.append(heading, statement, optionsGroup);
    container.appendChild(article);
  });

  const safeIndex = Math.max(0, Math.min(questions.length - 1, Number(currentIndex) || 0));
  return safeIndex;
}


/**
 * Renderiza toda la información de la pantalla de resultado del estudiante.
 */
export function renderStudentResultSummary(attempt = {}) {
  if (!attempt || typeof attempt !== 'object') return;

  const examTitle = attempt.examTitle ?? 'Nombre del examen';
  const studentName = attempt.studentName ?? 'Estudiante';
  const studentDoc = attempt.studentDocument ?? '';
  const correctCount = Number(attempt.correctCount ?? 0);
  const totalQuestions = Number(attempt.totalQuestions ?? 0);
  const scorePct = Number(attempt.scorePercentage ?? 0);
  const requiredPct = Number(attempt.approvalPercentage ?? 70);
  const passed = Boolean(attempt.passed);

  document.querySelectorAll('[data-exam-title]').forEach((el) => {
    el.textContent = examTitle;
  });

  const mainTitleEl = document.getElementById('result-exam-title');
  if (mainTitleEl && !mainTitleEl.querySelector('[data-exam-title]')) {
    mainTitleEl.textContent = `Resultado del examen — ${examTitle}`;
  }

  document.querySelectorAll('[data-student-name]').forEach((el) => {
    el.textContent = studentName;
  });

  document.querySelectorAll('[data-student-id]').forEach((el) => {
    el.textContent = studentDoc;
  });

  const correctEl = document.getElementById('result-correct-questions');
  if (correctEl) {
    correctEl.textContent = `${correctCount} / ${totalQuestions}`;
  }

  document.querySelectorAll('[data-correct-count]').forEach((el) => {
    el.textContent = String(correctCount);
  });

  document.querySelectorAll('[data-total-questions]').forEach((el) => {
    el.textContent = String(totalQuestions);
  });

  document.querySelectorAll('[data-obtained-percentage]').forEach((el) => {
    el.textContent = `${scorePct}%`;
  });

  document.querySelectorAll('[data-required-percentage]').forEach((el) => {
    el.textContent = `${requiredPct}%`;
  });

  const { hours, minutes, seconds } = splitSecondsToHMS(attempt.remainingSeconds ?? 0);
  const hrEl = document.getElementById('result-timer-hr');
  const minEl = document.getElementById('result-timer-min');
  const secEl = document.getElementById('result-timer-sec');

  if (hrEl) hrEl.textContent = padTwoDigits(hours);
  if (minEl) minEl.textContent = padTwoDigits(minutes);
  if (secEl) secEl.textContent = padTwoDigits(seconds);

  const approvedBox = document.getElementById('outcome-approved');
  const failedBox = document.getElementById('outcome-failed');

  if (approvedBox && failedBox) {
    if (passed) {
      approvedBox.classList.remove('is-hidden');
      failedBox.classList.add('is-hidden');
    } else {
      approvedBox.classList.add('is-hidden');
      failedBox.classList.remove('is-hidden');
    }
  }
}
