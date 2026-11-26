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
    list[qIdx] = q;

    const card = document.createElement('article');
    card.className = 'editable-question-card';
    card.dataset.questionId = String(q.id ?? '');
    card.dataset.questionNumber = String(qIdx + 1);
    card.dataset.questionIndex = String(qIdx);

    const headerRow = document.createElement('div');
    headerRow.className = 'editable-question-card__header';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'question-title-input';
    titleInput.id = `${mode}-q-title-${qIdx + 1}`;
    titleInput.value = q.title;
    titleInput.placeholder = `Pregunta ${qIdx + 1}`;
    titleInput.addEventListener('input', () => {
      q.title = titleInput.value;
      if (typeof onChange === 'function') onChange([...list]);
    });
    titleInput.addEventListener('blur', () => {
      q.title = capitalizeAfterPeriodOrNewline(titleInput.value.trim());
      titleInput.value = q.title;
      if (typeof onChange === 'function') onChange([...list]);
    });

    const deleteQuestionBtn = document.createElement('button');
    deleteQuestionBtn.type = 'button';
    deleteQuestionBtn.className = 'btn-remove-question';
    deleteQuestionBtn.textContent = 'Eliminar pregunta';
    deleteQuestionBtn.addEventListener('click', () => {
      const updated = removeQuestionFromList(list, qIdx);
      renderQuestionsEditor({ containerId, mode, questions: updated, onChange });
      if (typeof onChange === 'function') onChange(updated);
    });

    headerRow.append(titleInput, deleteQuestionBtn);

    const bodyBox = document.createElement('div');
    bodyBox.className = 'editable-question-card__body';

    const statementTextarea = document.createElement('textarea');
    statementTextarea.className = 'question-statement-input';
    statementTextarea.id = `${mode}-q-statement-${qIdx + 1}`;
    statementTextarea.value = q.statement;
    statementTextarea.placeholder = '[Enunciado de la pregunta]';
    statementTextarea.addEventListener('input', () => {
      q.statement = statementTextarea.value;
      if (typeof onChange === 'function') onChange([...list]);
    });
    statementTextarea.addEventListener('blur', () => {
      q.statement = capitalizeAfterPeriodOrNewline(statementTextarea.value.trim());
      statementTextarea.value = q.statement;
      if (typeof onChange === 'function') onChange([...list]);
    });

    const optionsList = document.createElement('div');
    optionsList.className = 'editable-options-group';
    optionsList.setAttribute('role', 'radiogroup');
    optionsList.setAttribute('aria-label', 'Seleccionar respuesta correcta');

    const optionRows = [];
    const radioName = `${mode}-correct-option-q${qIdx + 1}`;

    q.options.forEach((opt, optIdx) => {
      const optionRow = document.createElement('div');
      optionRow.className = opt.isCorrect
        ? 'editable-option-row is-selected'
        : 'editable-option-row';
      optionRow.dataset.optionIndex = String(optIdx);

      const radioId = `${mode}-q${qIdx + 1}-opt-${optIdx}`;
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = radioName;
      radio.id = radioId;
      radio.value = String(optIdx);
      radio.className = 'correct-option-radio';
      radio.checked = Boolean(opt.isCorrect);

      radio.addEventListener('change', () => {
        q.options.forEach((o, i) => {
          o.isCorrect = i === optIdx;
        });
        optionRows.forEach((rowEl, i) => {
          rowEl.classList.toggle('is-selected', i === optIdx);
        });
        if (typeof onChange === 'function') onChange([...list]);
      });

      const optionInput = document.createElement('input');
      optionInput.type = 'text';
      optionInput.className = 'option-description-input';
      optionInput.value = opt.text;
      optionInput.placeholder = `Opción de respuesta ${optIdx + 1}`;
      optionInput.addEventListener('input', () => {
        opt.text = optionInput.value;
        if (typeof onChange === 'function') onChange([...list]);
      });
      optionInput.addEventListener('blur', () => {
        opt.text = capitalizeAfterPeriodOrNewline(optionInput.value.trim());
        optionInput.value = opt.text;
        if (typeof onChange === 'function') onChange([...list]);
      });

      optionRow.append(radio, optionInput);
      optionRows.push(optionRow);
      optionsList.appendChild(optionRow);
    });

    bodyBox.append(statementTextarea, optionsList);
    card.append(headerRow, bodyBox);
    container.appendChild(card);
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

  const questionItems = container.querySelectorAll('.editable-question-card');
  return Array.from(questionItems).map((itemEl, qIdx) => {
    const rawTitle =
      itemEl.querySelector('.question-title-input')?.value?.trim() || `Pregunta ${qIdx + 1}`;
    const rawStatement =
      itemEl.querySelector('.question-statement-input')?.value?.trim() || '';
    const optionRows = itemEl.querySelectorAll('.editable-option-row');

    const options = Array.from(optionRows).map((rowEl, optIdx) => ({
      id: `opt-${optIdx}`,
      text: capitalizeAfterPeriodOrNewline(
        rowEl.querySelector('.option-description-input')?.value?.trim() || ''
      ),
      isCorrect: Boolean(rowEl.querySelector('.correct-option-radio')?.checked)
    }));

    return normalizeQuestionSchema(
      {
        id: itemEl.dataset.questionId || fallbackQuestions[qIdx]?.id || `q-${Date.now()}-${qIdx + 1}`,
        number: qIdx + 1,
        title: capitalizeAfterPeriodOrNewline(rawTitle),
        statement: capitalizeAfterPeriodOrNewline(rawStatement),
        options
      },
      qIdx
    );
  });
}
