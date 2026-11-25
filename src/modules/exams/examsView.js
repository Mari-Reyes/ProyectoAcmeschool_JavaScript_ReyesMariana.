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
  list: 'section-exams-list',
  view: 'section-exam-view',
  edit: 'section-exam-edit',
  create: 'section-exam-create',
  delete: 'section-exam-delete'
});

/**
 * Muestra únicamente la sección indicada de Gestión de exámenes y oculta las demás.
 */
export function setActiveExamSection(sectionKey) {
  Object.entries(EXAM_SECTION_IDS).forEach(([key, elementId]) => {
    const el = document.getElementById(elementId);
    if (!el) return;
    if (key === sectionKey) {
      el.classList.remove('is-hidden');
    } else {
      el.classList.add('is-hidden');
    }
  });
}

/**
 * Renderiza las tarjetas de exámenes en la lista de gestión o muestra el estado
 * vacío cuando no hay coincidencias en la búsqueda.
 */
export function renderManagementExamsList(exams = [], handlers = {}) {
  const listContainer =
    document.getElementById('exams-management-list') ||
    document.querySelector('[data-exams-list]');
  const emptyStateEl =
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
  const titleEl = document.getElementById('view-exam-title');
  const codeEl = document.getElementById('view-exam-code');
  const descEl = document.getElementById('view-exam-description');
  const durationEl = document.getElementById('view-exam-duration');
  const approvalEl = document.getElementById('view-exam-approval');
  const questionsContainer = document.getElementById('view-exam-questions');

  if (titleEl) titleEl.textContent = exam.title ?? 'Nombre del examen';
  if (codeEl) codeEl.textContent = exam.code ?? '';
  if (descEl) descEl.textContent = exam.description ?? '';

  if (durationEl) {
    const hms = formatHMS(exam.durationSeconds ?? 0);
    durationEl.textContent = `${hms.hr}:${hms.min}:${hms.sec}`;
  }

  if (approvalEl) {
    const pct = Number(exam.approvalPercentage ?? 70);
    approvalEl.textContent = `Porcentaje aprobación: ${pct}%`;
  }

  if (questionsContainer) {
    questionsContainer.innerHTML = '';
    const questions = Array.isArray(exam.questions) ? exam.questions : [];

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
