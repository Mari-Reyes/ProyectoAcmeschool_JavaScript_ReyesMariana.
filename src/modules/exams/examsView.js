/**
 * Vista: src/modules/exams/examsView.js
 * Renderiza el listado de gestión de exámenes, el estado vacío de búsqueda,
 * la vista previa de un examen y la visibilidad de secciones.
 */

import {
  createManagementExamCard,
  renderExamCardsList
} from '../../componets/exam-card.js';
import { initEditableTimerControls, formatHMS } from '../../componets/exam-timer.js';

export const EXAM_SECTION_IDS = Object.freeze({
  list: 'section-exams-main',
  view: 'section-view-exam',
  edit: 'section-edit-exam',
  create: 'section-create-exam',
  delete: 'modal-delete-exam'
});

/**
 * Muestra únicamente la sección indicada de Gestión de exámenes y oculta las demás.
 */
export function setActiveExamSection(sectionKey) {
  if (document.body && sectionKey) {
    document.body.dataset.examSection = sectionKey;
  }

  Object.entries(EXAM_SECTION_IDS).forEach(([key, elementId]) => {
    const el = document.getElementById(elementId);
    if (!el) return;

    const isTarget = key === sectionKey;
    if (el.classList.contains('modal-overlay')) {
      el.classList.toggle('is-hidden', !isTarget);
      return;
    }

    el.classList.toggle('is-hidden', !isTarget);
    el.classList.toggle('is-active', isTarget);
  });
}

/**
 * Renderiza las tarjetas de exámenes en la lista de gestión o muestra el estado
 * vacío cuando no hay coincidencias en la búsqueda.
 */
export function renderManagementExamsList(exams = [], handlers = {}) {
  const listContainer =
    document.getElementById('mgmt-exams-list') ||
    document.getElementById('exams-management-list') ||
    document.querySelector('[data-exams-list]');
  const emptyStateEl =
    document.getElementById('mgmt-exams-empty') ||
    document.getElementById('exams-empty-search') ||
    document.querySelector('[data-empty-search]');

  if (!listContainer) return;

  if (!Array.isArray(exams) || exams.length === 0) {
    listContainer.innerHTML = '';
    if (emptyStateEl) {
      emptyStateEl.classList.remove('is-hidden');
      if (!emptyStateEl.textContent.trim()) {
        emptyStateEl.textContent = 'No se encontraron resultados';
      }
    }
    return;
  }

  if (emptyStateEl) {
    emptyStateEl.classList.add('is-hidden');
  }

  renderExamCardsList(listContainer, exams, (exam) =>
    createManagementExamCard(exam, handlers)
  );
}

/**
 * Renderiza los detalles completos de un examen en la subsección "Ver examen".
 */
export function renderExamPreviewSection(exam = {}) {
  const titleEl =
    document.getElementById('view-exam-title') ||
    document.getElementById('preview-exam-title');
  const codeEl =
    document.getElementById('view-exam-code') ||
    document.getElementById('preview-exam-code');
  const descEl =
    document.getElementById('view-exam-description') ||
    document.getElementById('preview-exam-description');
  const durationEl = document.getElementById('view-exam-duration');
  const approvalEl =
    document.getElementById('view-exam-approval') ||
    document.getElementById('preview-approval');
  const questionsContainer =
    document.getElementById('view-exam-questions') ||
    document.getElementById('preview-questions-list');

  const hrEl = document.getElementById('preview-hr');
  const minEl = document.getElementById('preview-min');
  const secEl = document.getElementById('preview-sec');
  const totalQEl = document.getElementById('preview-total-questions');

  if (titleEl) titleEl.textContent = exam.title ?? 'Nombre del examen';
  if (codeEl) codeEl.textContent = exam.code ?? '';
  if (descEl) descEl.textContent = exam.description ?? '';

  const hms = formatHMS(exam.durationSeconds ?? 0);
  if (durationEl) {
    durationEl.textContent = `${hms.hr}:${hms.min}:${hms.sec}`;
  }
  if (hrEl) hrEl.textContent = hms.hr;
  if (minEl) minEl.textContent = hms.min;
  if (secEl) secEl.textContent = hms.sec;

  const pct = Number(exam.approvalPercentage ?? 70);
  if (approvalEl) {
    approvalEl.textContent = `Porcentaje aprobación: ${pct}%`;
  }

  const questions = Array.isArray(exam.questions) ? exam.questions : [];
  if (totalQEl) {
    totalQEl.textContent = String(questions.length);
  }

  if (questionsContainer) {
    questionsContainer.innerHTML = '';

    questions.forEach((question, index) => {
      const card = document.createElement('article');
      card.className = 'preview-question-card';

      const heading = document.createElement('h4');
      heading.className = 'preview-question-card__title';
      heading.textContent = `${question.title || `Pregunta ${index + 1}`}: ${question.statement}`;

      const list = document.createElement('ul');
      list.className = 'preview-options-list';

      (question.options ?? []).forEach((option) => {
        const li = document.createElement('li');
        li.className = option.isCorrect
          ? 'preview-option-item is-correct-answer'
          : 'preview-option-item';
        li.textContent = option.isCorrect
          ? `${option.text} (Respuesta correcta)`
          : option.text;
        list.appendChild(li);
      });

      card.append(heading, list);
      questionsContainer.appendChild(card);
    });
  }
}

/**
 * Inicializa los controles editables de tiempo (Hr, Min, Seg) en "Modificar examen".
 */
export function bindExamTimerEditor({ onChange = null } = {}) {
  return initEditableTimerControls({
    hrInputId: 'edit-timer-hr',
    minInputId: 'edit-timer-min',
    secInputId: 'edit-timer-sec',
    onChange
  });
}
