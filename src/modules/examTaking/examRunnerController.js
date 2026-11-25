/**
 * Controlador: src/modules/examTaking/examRunnerController.js
 * Coordina el flujo del estudiante: listado de exámenes, registro previo,
 * resolución con temporizador y guardado/visualización de resultados.
 */

import {
  createStudentExamCard,
  renderExamCardsList
} from '../../componets/exam-card.js';
import { renderStudentExamHeader } from '../../componets/exam-header.js';
import {
  openModal,
  closeModal,
  setAlertMessage,
  showToast
} from '../../componets/toast-alert.js';
import {
  isValidPersonName,
  isValidDocumentNumber,
  normalizeExamSchema
} from '../../data/shema.js';
import {
  renderQuestionStep,
  renderStudentResultSummary
} from './examRunnerView.js';
import {
  evaluateAndSaveExamAttempt,
  getLastExamAttempt,
  isExamCompletedByStudent,
  markExamCompletedByStudent
} from './gradingService.js';
import { ExamTimerController } from './timerService.js';

const EXAMS_STORAGE_KEY = 'acme_school_exams_v1';
const ACTIVE_STUDENT_EXAM_KEY = 'acme_school_active_student_exam_v1';

function loadAvailableExams() {
  try {
    const raw = localStorage.getItem(EXAMS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeExamSchema) : [];
  } catch (error) {
    console.error('Error al cargar exámenes disponibles:', error);
    return [];
  }
}

export function getActiveStudentExamSession() {
  try {
    const raw = localStorage.getItem(ACTIVE_STUDENT_EXAM_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    return null;
  }
}

export function setActiveStudentExamSession(sessionState) {
  try {
    if (!sessionState) {
      localStorage.removeItem(ACTIVE_STUDENT_EXAM_KEY);
      return;
    }
    localStorage.setItem(ACTIVE_STUDENT_EXAM_KEY, JSON.stringify(sessionState));
  } catch (error) {
    console.error('Error al guardar sesión de examen del estudiante:', error);
  }
}

function shuffleArray(items = []) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Inicializa la vista pública de exámenes disponibles para estudiantes.
 */
export function initStudentExamsCatalog({
  onStartExam = null,
  onViewResult = null
} = {}) {
  const container =
    document.getElementById('student-exams-list') ||
    document.querySelector('[data-student-exams-list]');
  if (!container) return;

  const exams = shuffleArray(loadAvailableExams());
  const session = getActiveStudentExamSession();
  const studentDoc = session?.student?.document ?? '';

  renderExamCardsList(container, exams, (exam) =>
    createStudentExamCard(exam, {
      isCompleted: isExamCompletedByStudent(exam.id, studentDoc),
      isLocked: false,
      onStart: (selectedExam) => {
        setActiveStudentExamSession({
          exam: selectedExam,
          student: null,
          answers: {},
          currentIndex: 0
        });
        if (typeof onStartExam === 'function') onStartExam(selectedExam);
      },
      onViewResult: (selectedExam) => {
        if (typeof onViewResult === 'function') onViewResult(selectedExam);
      }
    })
  );
}

/**
 * Inicializa el registro previo del estudiante antes de iniciar la prueba.
 */
export function initStudentExamRegistration({
  onProceed = null
} = {}) {
  const session = getActiveStudentExamSession();
  const exams = loadAvailableExams();
  const exam = session?.exam ? normalizeExamSchema(session.exam) : exams[0] ?? null;

  if (exam) {
    renderStudentExamHeader({ exam, totalQuestions: exam.questions.length });
  }

  const form =
    document.getElementById('student-registration-form') ||
    document.querySelector('[data-student-registration-form]');
  const nameInput =
    document.getElementById('student-name-input') ||
    document.querySelector('[name="studentName"]');
  const docInput =
    document.getElementById('student-id-input') ||
    document.querySelector('[name="studentDocument"]');

  if (!form || !nameInput || !docInput) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fullName = String(nameInput.value ?? '').trim();
    const docNumber = String(docInput.value ?? '').trim();

    if (!isValidPersonName(fullName) || !isValidDocumentNumber(docNumber) || !exam) {
      setAlertMessage({
        modalId: 'modal-student-validation',
        messageSelector: '#modal-student-validation-message',
        message:
          'Completa correctamente tu nombre y apellido (solo letras y espacios) y tu número de identificación (solo números).',
        open: true
      });
      return;
    }

    const nextSession = {
      exam,
      student: { name: fullName, document: docNumber },
      answers: {},
      currentIndex: 0,
      startedAt: new Date().toISOString()
    };

    setActiveStudentExamSession(nextSession);
    if (typeof onProceed === 'function') onProceed(nextSession);
  });
}

/**
 * Inicializa la resolución activa del examen con cronómetro y navegación de preguntas.
 */
export function initExamRunnerSession({
  onFinishExam = null
} = {}) {
  const session = getActiveStudentExamSession();
  const exams = loadAvailableExams();
  const exam = session?.exam ? normalizeExamSchema(session.exam) : exams[0] ?? null;
  const student = session?.student ?? { name: 'Estudiante', document: '' };

  if (!exam) return;

  renderStudentExamHeader({
    exam,
    student,
    totalQuestions: exam.questions.length
  });

  let currentIndex = Number(session?.currentIndex ?? 0);
  const answers = { ...(session?.answers ?? {}) };
  let submitted = false;

  const nextOrFinishBtn = document.getElementById('btn-next-question');
  const finishBtn = document.getElementById('btn-finish-exam');

  const timer = new ExamTimerController({
    initialSeconds: exam.durationSeconds,
    onTimeout: (snapshot) => {
      if (submitted) return;
      setAlertMessage({
        modalId: 'modal-time-expired',
        messageSelector: '#modal-time-expired-message',
        message:
          'El tiempo del examen ha terminado. Se registrarán tus respuestas actuales.',
        open: true
      });
      submitExamAttempt(snapshot.remainingSeconds, true);
    }
  });

  function paintQuestion() {
    currentIndex = renderQuestionStep({
      questions: exam.questions,
      currentIndex,
      answers,
      onSelectOption: (questionId, optionId) => {
        answers[questionId] = optionId;
        setActiveStudentExamSession({
          exam,
          student,
          answers,
          currentIndex
        });
        paintQuestion();
      }
    });

    if (nextOrFinishBtn) {
      const isLast = currentIndex >= exam.questions.length - 1;
      nextOrFinishBtn.textContent = isLast ? 'Finalizar examen' : 'Siguiente pregunta';
    }
  }

  function hasMissingAnswers() {
    return exam.questions.some((q) => !answers[q.id]);
  }

  function submitExamAttempt(remainingSec, autoByTimeout = false) {
    if (submitted) return;
    submitted = true;
    timer.stop();

    const attempt = evaluateAndSaveExamAttempt({
      exam,
      student,
      answers,
      remainingSeconds: remainingSec,
      autoSubmittedByTimeout: autoByTimeout
    });

    if (typeof onFinishExam === 'function') onFinishExam(attempt);
  }

  if (nextOrFinishBtn) {
    nextOrFinishBtn.addEventListener('click', () => {
      const isLast = currentIndex >= exam.questions.length - 1;
      if (!isLast) {
        currentIndex += 1;
        setActiveStudentExamSession({
          exam,
          student,
          answers,
          currentIndex
        });
        paintQuestion();
        return;
      }

      if (hasMissingAnswers()) {
        setAlertMessage({
          modalId: 'modal-unanswered-questions',
          messageSelector: '#modal-unanswered-questions-message',
          message:
            'Tienes preguntas sin responder. ¿Deseas enviar el examen de todas formas?',
          open: true
        });
        return;
      }

      submitExamAttempt(timer.getRemainingSeconds(), false);
    });
  }

  const confirmMissingBtn = document.getElementById('btn-confirm-unanswered-finish');
  if (confirmMissingBtn) {
    confirmMissingBtn.addEventListener('click', () => {
      closeModal('modal-unanswered-questions');
      submitExamAttempt(timer.getRemainingSeconds(), false);
    });
  }

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      if (hasMissingAnswers()) {
        setAlertMessage({
          modalId: 'modal-unanswered-questions',
          messageSelector: '#modal-unanswered-questions-message',
          message:
            'Tienes preguntas sin responder. ¿Deseas enviar el examen de todas formas?',
          open: true
        });
        return;
      }
      submitExamAttempt(timer.getRemainingSeconds(), false);
    });
  }

  paintQuestion();
  timer.start();
}

/**
 * Inicializa la pantalla de resultado del estudiante y el marcado como hecho.
 */
export function initStudentResultScreen({
  onBackToCatalog = null
} = {}) {
  const attempt = getLastExamAttempt();
  if (!attempt) return;

  renderStudentResultSummary(attempt);

  const markDoneBtn = document.getElementById('btn-mark-exam-done');
  if (markDoneBtn) {
    markDoneBtn.addEventListener('click', () => {
      markExamCompletedByStudent(attempt.examId, attempt.studentDocument);
      showToast('Marcado como hecho', { type: 'success' });
      if (typeof onBackToCatalog === 'function') {
        window.setTimeout(() => onBackToCatalog(attempt), 500);
      }
    });
  }
}
