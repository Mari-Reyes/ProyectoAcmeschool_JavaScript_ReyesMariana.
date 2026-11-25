/**
 * Gestor de preguntas: src/modules/exams/questionsManager.js
 * Administra la creación, edición, eliminación, renumeración y lectura
 * de preguntas y sus opciones de respuesta en los formularios de examen.
 */

import {
  capitalizeAfterPeriodOrNewline,
  normalizeQuestionSchema
} from '../../data/shema.js';

/**
 * Crea una pregunta vacía normalizada con 4 opciones de respuesta.
 */
export function createEmptyQuestion(number = 1) {
  return normalizeQuestionSchema(
    {
      id: `q-${Date.now()}-${number}`,
      number,
      title: `Pregunta ${number}`,
      statement: '',
      options: [
        { id: 'opt-0', text: '', isCorrect: true },
        { id: 'opt-1', text: '', isCorrect: false },
        { id: 'opt-2', text: '', isCorrect: false },
        { id: 'opt-3', text: '', isCorrect: false }
      ]
    },
    number - 1
  );
}

/**
 * Agrega una nueva pregunta al arreglo y renumera de 1 a N.
 */
export function addQuestionToList(questions = []) {
  const base = Array.isArray(questions) ? [...questions] : [];
  const nextNumber = base.length + 1;
  base.push(createEmptyQuestion(nextNumber));
  return base.map((q, idx) => normalizeQuestionSchema({ ...q, number: idx + 1 }, idx));
}

/**
 * Elimina la pregunta en el índice indicado y renumera el resto.
 */
export function removeQuestionFromList(questions = [], indexToRemove = -1) {
  const base = Array.isArray(questions) ? [...questions] : [];
  if (indexToRemove < 0 || indexToRemove >= base.length) return base;
  base.splice(indexToRemove, 1);
  return base.map((q, idx) => normalizeQuestionSchema({ ...q, number: idx + 1 }, idx));
}

/**
 * Renderiza el editor de preguntas dentro del contenedor indicado ('edit-questions-list'
 * o 'create-questions-list'), con soporte para marcar la respuesta correcta y
 * normalizar mayúsculas tras punto o salto de línea.
 */
export function renderQuestionsEditor({
  containerId,
  mode = 'edit',
  questions = [],
  onChange = null
} = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const list = Array.isArray(questions) ? questions : [];

  list.forEach((rawQ, qIdx) => {
    const q = normalizeQuestionSchema({ ...rawQ, number: qIdx + 1 }, qIdx);

    const wrapper = document.createElement('div');
    wrapper.className = `${mode}-question-item`;
    wrapper.dataset.questionIndex = String(qIdx);

    const headerRow = document.createElement('div');
    headerRow.className = `${mode}-question-header`;

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = `${mode}-question-title`;
    titleInput.value = q.title;
    titleInput.placeholder = `Título Pregunta ${qIdx + 1}`;
    titleInput.addEventListener('blur', () => {
      q.title = capitalizeAfterPeriodOrNewline(titleInput.value.trim());
      titleInput.value = q.title;
      if (typeof onChange === 'function') onChange(list);
    });

    const deleteQuestionBtn = document.createElement('button');
    deleteQuestionBtn.type = 'button';
    deleteQuestionBtn.className = `${mode}-remove-question-btn`;
    deleteQuestionBtn.textContent = 'Eliminar pregunta';
    deleteQuestionBtn.addEventListener('click', () => {
      const updated = removeQuestionFromList(list, qIdx);
      renderQuestionsEditor({ containerId, mode, questions: updated, onChange });
      if (typeof onChange === 'function') onChange(updated);
    });

    headerRow.append(titleInput, deleteQuestionBtn);

    const statementTextarea = document.createElement('textarea');
    statementTextarea.className = `${mode}-question-statement`;
    statementTextarea.value = q.statement;
    statementTextarea.placeholder = 'Escribe el enunciado de la pregunta...';
    statementTextarea.addEventListener('blur', () => {
      q.statement = capitalizeAfterPeriodOrNewline(statementTextarea.value.trim());
      statementTextarea.value = q.statement;
      if (typeof onChange === 'function') onChange(list);
    });

    const optionsList = document.createElement('div');
    optionsList.className = `${mode}-options-list`;

    q.options.forEach((opt, optIdx) => {
      const optionRow = document.createElement('div');
      optionRow.className = opt.isCorrect
        ? `${mode}-option-row is-selected`
        : `${mode}-option-row`;

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = `${mode}-correct-option-${qIdx}`;
      radio.checked = Boolean(opt.isCorrect);
      radio.addEventListener('change', () => {
        q.options.forEach((o, i) => {
          o.isCorrect = i === optIdx;
        });
        renderQuestionsEditor({ containerId, mode, questions: list, onChange });
        if (typeof onChange === 'function') onChange(list);
      });

      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.className = `${mode}-option-text`;
      optionInput.value = opt.text;
      optionInput.placeholder = `Opción ${optIdx + 1}`;
      optionInput.addEventListener('blur', () => {
        opt.text = capitalizeAfterPeriodOrNewline(optionInput.value.trim());
        optionInput.value = opt.text;
        if (typeof onChange === 'function') onChange(list);
      });

      optionRow.append(radio, optionInput);
      optionsList.appendChild(optionRow);
    });

    wrapper.append(headerRow, statementTextarea, optionsList);
    container.appendChild(wrapper);
  });
}

/**
 * Lee y normaliza todas las preguntas y opciones renderizadas en el DOM.
 */
export function collectQuestionsFromEditor(containerId, mode = 'edit', fallbackQuestions = []) {
  const container = document.getElementById(containerId);
  if (!container) {
    return (Array.isArray(fallbackQuestions) ? fallbackQuestions : []).map((q, idx) =>
      normalizeQuestionSchema({ ...q, number: idx + 1 }, idx)
    );
  }

  const questionItems = container.querySelectorAll(`.${mode}-question-item`);
  return Array.from(questionItems).map((itemEl, qIdx) => {
    const rawTitle = itemEl.querySelector(`.${mode}-question-title`)?.value?.trim() || `Pregunta ${qIdx + 1}`;
    const rawStatement = itemEl.querySelector(`.${mode}-question-statement`)?.value?.trim() || '';
    const optionRows = itemEl.querySelectorAll(`.${mode}-option-row`);

    const options = Array.from(optionRows).map((rowEl, optIdx) => ({
      id: `opt-${optIdx}`,
      text: capitalizeAfterPeriodOrNewline(
        rowEl.querySelector(`.${mode}-option-text`)?.value?.trim() || ''
      ),
      isCorrect: Boolean(rowEl.querySelector('input[type="radio"]')?.checked)
    }));

    return normalizeQuestionSchema(
      {
        id: fallbackQuestions[qIdx]?.id ?? `q-${Date.now()}-${qIdx + 1}`,
        number: qIdx + 1,
        title: capitalizeAfterPeriodOrNewline(rawTitle),
        statement: capitalizeAfterPeriodOrNewline(rawStatement),
        options
      },
      qIdx
    );
  });
}
