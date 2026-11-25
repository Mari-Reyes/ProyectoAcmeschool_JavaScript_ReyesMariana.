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

export function initExamsControllers({ onNavigate = null } = {}) {
  const session = getActiveSession();
  renderAuthenticatedUserGreeting(session);

  let allExams = loadExamsFromStorage();
  let activeExam = null;
  let editDraft = null;
  let createQuestionsDraft = [];

  const searchInput =
    document.getElementById('search-exams-input') ||
    document.querySelector('[data-search-exams]');

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
        setActiveExamSection('delete');
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
    createQuestionsDraft = [];
    updateQuestionCounter(0);
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

  // Ir a sección Crear examen
  const goCreateBtn =
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
  const saveEditBtn = document.getElementById('btn-save-edit-exam');
  if (saveEditBtn) {
    saveEditBtn.addEventListener('click', () => {
      if (!editDraft) return;
      const titleInput = document.getElementById('edit-exam-title');
      const descInput = document.getElementById('edit-exam-description');
      const approvalInput = document.getElementById('edit-approval-input');

      const collectedQuestions = collectQuestionsFromEditor(
        'edit-questions-list',
        'edit',
        editDraft.questions
      );

      const candidate = normalizeExamSchema({
        ...editDraft,
        code: editDraft.code,
        title: capitalizeAfterPeriodOrNewline((titleInput?.value ?? editDraft.title).trim()),
        description: capitalizeAfterPeriodOrNewline(
          (descInput?.value ?? editDraft.description).trim()
        ),
        approvalPercentage: approvalInput
          ? Math.max(1, Math.min(100, Number(approvalInput.value) || editDraft.approvalPercentage))
          : editDraft.approvalPercentage,
        durationSeconds: timerEditor.getDurationSeconds(),
        durationMinutes: Math.max(1, Math.ceil(timerEditor.getDurationSeconds() / 60)),
        questions: collectedQuestions
      });

      const validation = validateExamSchema(candidate);
      if (!validation.valid) {
        setAlertMessage({
          modalId: 'modal-exam-error',
          messageSelector: '#modal-exam-error-message',
          message:
            'Revisa que la información que escribiste cumple con las validaciones.',
          open: true
        });
        return;
      }

      editDraft = candidate;
      setAlertMessage({
        modalId: 'modal-confirm-save-edit',
        messageSelector: '#modal-confirm-save-edit-message',
        message: '¿Estás seguro de guardar los cambios modificados?',
        open: true
      });
    });
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
  const saveCreateBtn = document.getElementById('btn-save-create-exam');
  if (saveCreateBtn) {
    saveCreateBtn.addEventListener('click', () => {
      const codeInput = document.getElementById('create-exam-code');
      const titleInput = document.getElementById('create-exam-title');
      const descInput = document.getElementById('create-exam-description');
      const minutesInput = document.getElementById('create-exam-minutes');
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
        setAlertMessage({
          modalId: 'modal-exam-error',
          messageSelector: '#modal-exam-error-message',
          message:
            'Revisa que la información que escribiste cumple con las validaciones.',
          open: true
        });
        return;
      }

      allExams.push(newExam);
      saveExamsToStorage(allExams);
      showToast('Examen creado correctamente', { type: 'success' });
      createQuestionsDraft = [];
      refreshList(filterExamsByQuery(allExams, searchInput?.value ?? ''));
      setActiveExamSection('list');
    });
  }

  // Eliminar examen
  const triggerDeleteBtn = document.getElementById('btn-trigger-delete-exam');
  if (triggerDeleteBtn) {
    triggerDeleteBtn.addEventListener('click', () => {
      if (!activeExam) return;
      setAlertMessage({
        modalId: 'modal-confirm-delete-exam',
        messageSelector: '#modal-confirm-delete-exam-message',
        message: '¿Estás seguro de eliminar este examen?',
        open: true
      });
    });
  }

  const confirmDeleteBtn = document.getElementById('btn-confirm-delete-exam');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (!activeExam) return;
      allExams = allExams.filter((item) => item.id !== activeExam.id);
      saveExamsToStorage(allExams);
      closeModal('modal-confirm-delete-exam');
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
