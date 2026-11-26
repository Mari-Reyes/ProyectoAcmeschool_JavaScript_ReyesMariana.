/**
 * Controlador: src/modules/exams/examsControllers.js
 * Coordina el estado y las acciones de Gestión de exámenes (listado aleatorio,
 * búsqueda, ver, modificar, crear y eliminar) conectando la vista y el gestor de preguntas.
 */

import {
  renderAuthenticatedUserGreeting,
  updateQuestionCounter
} from '../../componets/exam-header.js';
import {
  openModal,
  closeModal,
  setAlertMessage,
  showToast
} from '../../componets/toast-alert.js';
import {
  capitalizeAfterPeriodOrNewline,
  normalizeExamSchema,
  validateExamSchema
} from '../../data/shema.js';
import { getActiveSession } from '../../auth/authService.js';
import {
  renderManagementExamsList,
  renderExamPreviewSection,
  setActiveExamSection,
  bindExamTimerEditor
} from './examsView.js';
import {
  createEmptyQuestion,
  renderQuestionsEditor,
  collectQuestionsFromEditor,
  addQuestionToList,
  removeQuestionFromList
} from './questionsManager.js';

const EXAMS_STORAGE_KEY = 'acme_school_exams_v1';

const FALLBACK_EXAMS = [
  {
    id: 'exam-seed-1',
    code: 'MAT-101',
    title: 'Fundamentos de Álgebra y Ecuaciones',
    description:
      'Evaluación sobre ecuaciones lineales, expresiones algebraicas y resolución de problemas.',
    durationMinutes: 30,
    durationSeconds: 1800,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-mat-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Cuál es el valor de x en la ecuación 2x + 6 = 14?',
        options: [
          { id: 'opt-0', text: 'x = 4', isCorrect: true },
          { id: 'opt-1', text: 'x = 10', isCorrect: false },
          { id: 'opt-2', text: 'x = 3', isCorrect: false },
          { id: 'opt-3', text: 'x = 8', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-seed-2',
    code: 'PROG-201',
    title: 'Lógica y Estructuras en JavaScript',
    description:
      'Conceptos básicos de arreglos, funciones, objetos y control de flujo en JavaScript.',
    durationMinutes: 40,
    durationSeconds: 2400,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-prog-1',
        number: 1,
        title: 'Pregunta 1',
        statement:
          '¿Qué método agrega uno o más elementos al final de un arreglo en JavaScript?',
        options: [
          { id: 'opt-0', text: 'push()', isCorrect: true },
          { id: 'opt-1', text: 'pop()', isCorrect: false },
          { id: 'opt-2', text: 'shift()', isCorrect: false },
          { id: 'opt-3', text: 'slice()', isCorrect: false }
        ]
      }
    ]
  }
];

export function loadExamsFromStorage() {
  try {
    const raw = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeExamSchema) : [];
  } catch (error) {
    console.error('Error al cargar exámenes desde localStorage:', error);
    return [];
  }
}

export function saveExamsToStorage(exams = []) {
  try {
    const normalized = Array.isArray(exams) ? exams.map(normalizeExamSchema) : [];
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(normalized));
    return true;
  } catch (error) {
    console.error('Error al guardar exámenes en localStorage:', error);
    return false;
  }
}

export function shuffleExams(exams = []) {
  const copy = Array.isArray(exams) ? [...exams] : [];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function filterExamsByQuery(exams = [], query = '') {
  const term = String(query ?? '').trim().toLowerCase();
  if (!term) return [...exams];

  return exams.filter((exam) => {
    const code = String(exam.code ?? '').toLowerCase();
    const title = String(exam.title ?? '').toLowerCase();
    const desc = String(exam.description ?? '').toLowerCase();
    return code.includes(term) || title.includes(term) || desc.includes(term);
  });
}

function sanitizeQuestionsForSave(questions = [], fallbackQuestions = []) {
  const source =
    Array.isArray(questions) && questions.length > 0
      ? questions
      : Array.isArray(fallbackQuestions) && fallbackQuestions.length > 0
      ? fallbackQuestions
      : [createEmptyQuestion(1)];

  return source.map((q, qIdx) => {
    const rawOpts = Array.isArray(q.options) ? q.options : [];
    const fourOpts = [0, 1, 2, 3].map((oIdx) => {
      const existing = rawOpts[oIdx] || {};
      const textVal = capitalizeAfterPeriodOrNewline(
        String(existing.text ?? '').trim() || `Opción ${oIdx + 1}`
      );
      return {
        id: existing.id || `opt-${oIdx}`,
        text: textVal,
        isCorrect: Boolean(existing.isCorrect)
      };
    });

    if (!fourOpts.some((o) => o.isCorrect)) {
      fourOpts[0].isCorrect = true;
    }

    return {
      id: q.id || `q-${Date.now()}-${qIdx + 1}`,
      number: qIdx + 1,
      title: capitalizeAfterPeriodOrNewline(
        String(q.title ?? '').trim() || `Pregunta ${qIdx + 1}`
      ),
      statement: capitalizeAfterPeriodOrNewline(
        String(q.statement ?? '').trim() || `Enunciado de la pregunta ${qIdx + 1}`
      ),
      options: fourOpts
    };
  });
}

export function initExamsControllers({ onNavigate = null } = {}) {
  const session = getActiveSession();
  renderAuthenticatedUserGreeting(session);

  let allExams = loadExamsFromStorage();
  if (allExams.length === 0) {
    allExams = FALLBACK_EXAMS.map(normalizeExamSchema);
    saveExamsToStorage(allExams);
  }

  let activeExam = null;
  let editDraft = null;
  let createQuestionsDraft = [];

  const searchInput =
    document.getElementById('input-search-exam-mgmt') ||
    document.getElementById('search-exams-input') ||
    document.querySelector('[data-search-exams]');

  const searchBtn = document.getElementById('btn-search-exam-mgmt');

  const timerEditor = bindExamTimerEditor({
    onChange: ({ totalSeconds }) => {
      if (editDraft) {
        editDraft.durationSeconds = totalSeconds;
      }
    }
  });

  function refreshList(items = shuffleExams(allExams)) {
    renderManagementExamsList(items, {
      onView: (exam) => {
        activeExam = normalizeExamSchema(exam);
        renderExamPreviewSection(activeExam);
        setActiveExamSection('view');
      },
      onEdit: (exam) => {
        editDraft = normalizeExamSchema(exam);
        openEditSection(editDraft);
      },
      onDelete: (exam) => {
        activeExam = normalizeExamSchema(exam);
        const nameEl = document.getElementById('delete-exam-name');
        const codeEl = document.getElementById('delete-exam-code');
        if (nameEl) nameEl.textContent = activeExam.title;
        if (codeEl) codeEl.textContent = activeExam.code;
        openModal('modal-delete-exam');
      }
    });
  }

  function openEditSection(exam) {
    const codeInput = document.getElementById('edit-exam-code');
    const titleInput = document.getElementById('edit-exam-title');
    const descInput = document.getElementById('edit-exam-description');
    const approvalEl = document.getElementById('edit-approval');

    if (codeInput) {
      codeInput.value = exam.code;
      codeInput.readOnly = true;
      codeInput.disabled = true;
    }
    if (titleInput) titleInput.value = exam.title;
    if (descInput) descInput.value = exam.description;
    if (approvalEl) {
      approvalEl.textContent = `Porcentaje aprobación: ${exam.approvalPercentage}%`;
    }

    timerEditor.setDurationSeconds(exam.durationSeconds);
    updateQuestionCounter(exam.questions.length);

    renderQuestionsEditor({
      containerId: 'edit-questions-list',
      mode: 'edit',
      questions: exam.questions,
      onChange: (updatedQuestions) => {
        if (editDraft) {
          editDraft.questions = updatedQuestions;
          updateQuestionCounter(editDraft.questions.length);
        }
      }
    });

    setActiveExamSection('edit');
  }

  function openCreateSection() {
    createQuestionsDraft = [createEmptyQuestion(1)];
    updateQuestionCounter(createQuestionsDraft.length);
    renderQuestionsEditor({
      containerId: 'create-questions-list',
      mode: 'create',
      questions: createQuestionsDraft,
      onChange: (updatedQuestions) => {
        createQuestionsDraft = updatedQuestions;
        updateQuestionCounter(createQuestionsDraft.length);
      }
    });
    setActiveExamSection('create');
  }

  // Búsqueda
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      refreshList(filterExamsByQuery(allExams, searchInput.value));
    });
  }
  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      refreshList(filterExamsByQuery(allExams, searchInput.value));
    });
  }

  // Ir a sección Crear examen
  const goCreateBtn =
    document.getElementById('btn-open-create-exam') ||
    document.getElementById('btn-go-create-exam') ||
    document.querySelector('[data-action="go-create-exam"]');
  if (goCreateBtn) {
    goCreateBtn.addEventListener('click', openCreateSection);
  }

  // Agregar / eliminar preguntas en Modificar
  const addEditQBtn = document.getElementById('btn-add-edit-question');
  if (addEditQBtn) {
    addEditQBtn.addEventListener('click', () => {
      if (!editDraft) return;
      editDraft.questions = addQuestionToList(editDraft.questions);
      updateQuestionCounter(editDraft.questions.length);
      renderQuestionsEditor({
        containerId: 'edit-questions-list',
        mode: 'edit',
        questions: editDraft.questions,
        onChange: (updated) => {
          editDraft.questions = updated;
          updateQuestionCounter(editDraft.questions.length);
        }
      });
    });
  }

  const removeLastEditQBtn = document.getElementById('btn-remove-edit-question');
  if (removeLastEditQBtn) {
    removeLastEditQBtn.addEventListener('click', () => {
      if (!editDraft || !editDraft.questions.length) return;
      editDraft.questions = removeQuestionFromList(
        editDraft.questions,
        editDraft.questions.length - 1
      );
      updateQuestionCounter(editDraft.questions.length);
      renderQuestionsEditor({
        containerId: 'edit-questions-list',
        mode: 'edit',
        questions: editDraft.questions,
        onChange: (updated) => {
          editDraft.questions = updated;
          updateQuestionCounter(editDraft.questions.length);
        }
      });
    });
  }

  // Guardar cambios en Modificar examen
  const editForm = document.getElementById('edit-exam-form');
  const saveEditBtn =
    document.getElementById('btn-save-exam-changes') ||
    document.getElementById('btn-save-edit-exam');

  function handleSaveEditExam(event) {
    if (event) event.preventDefault();
    if (!editDraft) return;

    const titleInput = document.getElementById('edit-exam-title');
    const descInput = document.getElementById('edit-exam-description');
    const approvalInput = document.getElementById('edit-approval-input');

    const rawTitle = (titleInput?.value ?? editDraft.title ?? '').trim();
    const rawDesc = (descInput?.value ?? editDraft.description ?? '').trim();

    if (!rawTitle || !rawDesc) {
      showToast('Completa el nombre y la descripción del examen antes de guardar.', {
        type: 'error'
      });
      return;
    }

    const collectedQuestions = collectQuestionsFromEditor(
      'edit-questions-list',
      'edit',
      editDraft.questions
    );
    const safeQuestions = sanitizeQuestionsForSave(collectedQuestions, editDraft.questions);

    const totalSec = Math.max(60, Number(timerEditor.getDurationSeconds()) || (editDraft.durationMinutes || 30) * 60);
    const updatedExam = normalizeExamSchema({
      ...editDraft,
      code: editDraft.code,
      title: capitalizeAfterPeriodOrNewline(rawTitle),
      description: capitalizeAfterPeriodOrNewline(rawDesc),
      approvalPercentage: approvalInput
        ? Math.max(1, Math.min(100, Number(approvalInput.value) || editDraft.approvalPercentage || 70))
        : editDraft.approvalPercentage || 70,
      durationSeconds: totalSec,
      durationMinutes: Math.max(1, Math.round(totalSec / 60)),
      questions: safeQuestions
    });

    editDraft = updatedExam;
    const exists = allExams.some(
      (item) => item.id === updatedExam.id || item.code === updatedExam.code
    );
    allExams = exists
      ? allExams.map((item) =>
          item.id === updatedExam.id || item.code === updatedExam.code ? updatedExam : item
        )
      : [...allExams, updatedExam];

    saveExamsToStorage(allExams);
    refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
    setActiveExamSection('list');
    showToast('Cambios guardados correctamente', { type: 'success' });
  }

  if (editForm) {
    editForm.addEventListener('submit', handleSaveEditExam);
  }
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', handleSaveEditExam);
  }

  const confirmSaveEditBtn = document.getElementById('btn-confirm-save-edit');
  if (confirmSaveEditBtn) {
    confirmSaveEditBtn.addEventListener('click', () => {
      if (!editDraft) return;
      allExams = allExams.map((item) => (item.id === editDraft.id ? editDraft : item));
      saveExamsToStorage(allExams);
      closeModal('modal-confirm-save-edit');
      setAlertMessage({
        modalId: 'modal-exam-success',
        messageSelector: '#modal-exam-success-message',
        message: 'Cambios guardados correctamente',
        open: true
      });
      refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
      setActiveExamSection('list');
    });
  }

  // Agregar pregunta en Crear examen
  const addCreateQBtn = document.getElementById('btn-add-create-question');
  if (addCreateQBtn) {
    addCreateQBtn.addEventListener('click', () => {
      createQuestionsDraft = addQuestionToList(createQuestionsDraft);
      updateQuestionCounter(createQuestionsDraft.length);
      renderQuestionsEditor({
        containerId: 'create-questions-list',
        mode: 'create',
        questions: createQuestionsDraft,
        onChange: (updated) => {
          createQuestionsDraft = updated;
          updateQuestionCounter(createQuestionsDraft.length);
        }
      });
    });
  }

  // Guardar nuevo examen
  const createForm = document.getElementById('create-exam-form');
  const saveCreateBtn =
    document.getElementById('btn-save-new-exam') ||
    document.getElementById('btn-save-create-exam');

  function handleSaveCreateExam(event) {
    if (event) event.preventDefault();

    const codeInput = document.getElementById('create-exam-code');
    const titleInput = document.getElementById('create-exam-title');
    const descInput = document.getElementById('create-exam-description');
    const minutesInput =
      document.getElementById('create-exam-duration') ||
      document.getElementById('create-exam-minutes');
    const approvalInput = document.getElementById('create-exam-approval');

    const minutes = Math.max(1, Number(minutesInput?.value ?? 30) || 30);
    const collectedQuestions = collectQuestionsFromEditor(
      'create-questions-list',
      'create',
      createQuestionsDraft
    );

    const newExam = normalizeExamSchema({
      id: `exam-${Date.now()}`,
      code: codeInput?.value?.trim() || '',
      title: titleInput?.value?.trim() || '',
      description: descInput?.value?.trim() || '',
      durationMinutes: minutes,
      durationSeconds: minutes * 60,
      approvalPercentage: approvalInput ? Number(approvalInput.value) || 70 : 70,
      questions: collectedQuestions.length ? collectedQuestions : [createEmptyQuestion(1)]
    });

    const validation = validateExamSchema(newExam, {
      requireUniqueCodeCheck: (code) =>
        allExams.some(
          (existing) => String(existing.code).toUpperCase() === String(code).toUpperCase()
        )
    });

    if (!validation.valid) {
      const firstError =
        Object.values(validation.errors || {})[0] ||
        'Revisa que la información que escribiste cumple con las validaciones.';
      setAlertMessage({
        modalId: 'modal-exam-error',
        messageSelector: '#modal-exam-error-message',
        message: firstError,
        open: true
      });
      showToast(firstError, { type: 'error' });
      return;
    }

    allExams.push(newExam);
    saveExamsToStorage(allExams);
    showToast('Examen creado correctamente', { type: 'success' });
    createQuestionsDraft = [];
    if (createForm) createForm.reset();
    refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
    setActiveExamSection('list');
  }

  if (createForm) {
    createForm.addEventListener('submit', handleSaveCreateExam);
  }
  if (saveCreateBtn) {
    saveCreateBtn.addEventListener('click', handleSaveCreateExam);
  }

  // Eliminar examen
  const triggerDeleteBtn = document.getElementById('btn-trigger-delete-exam');
  if (triggerDeleteBtn) {
    triggerDeleteBtn.addEventListener('click', () => {
      if (!activeExam) return;
      openModal('modal-delete-exam');
    });
  }

  const confirmDeleteBtn = document.getElementById('btn-confirm-delete-exam');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!activeExam) return;
      allExams = allExams.filter((item) => item.id !== activeExam.id);
      saveExamsToStorage(allExams);
      closeModal('modal-delete-exam');
      showToast('Examen eliminado correctamente', { type: 'success' });
      activeExam = null;
      refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
      setActiveExamSection('list');
    });
  }

  // Volver al listado
  document.querySelectorAll('[data-back-to-exams-list]').forEach((btn) => {
    btn.addEventListener('click', () => {
      refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
      setActiveExamSection('list');
      if (typeof onNavigate === 'function') onNavigate('list');
    });
  });

  setActiveExamSection('list');
  refreshList();

  return {
    refresh: () => {
      allExams = loadExamsFromStorage();
      refreshList(shuffleExams(allExams));
    }
  };
}
