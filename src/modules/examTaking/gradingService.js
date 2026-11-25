/**
 * Servicio de calificación: src/modules/examTaking/gradingService.js
 * Evalúa las respuestas del estudiante, determina aprobación/no aprobación,
 * persiste los intentos en localStorage y administra los exámenes marcados como hechos.
 */

import { formatHMS } from '../../componets/exam-timer.js';
import { normalizeExamSchema } from '../../data/shema.js';

const ATTEMPTS_STORAGE_KEY = 'acme_school_exam_attempts_v1';
const LAST_ATTEMPT_STORAGE_KEY = 'acme_school_last_exam_result_v1';
const COMPLETED_EXAMS_STORAGE_KEY = 'acme_school_completed_exams_v1';

function readArray(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error al leer ${key} desde localStorage:`, error);
    return [];
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error al escribir ${key} en localStorage:`, error);
    return false;
  }
}

/**
 * Obtiene todos los intentos guardados de exámenes.
 */
export function getAllExamAttempts() {
  return readArray(ATTEMPTS_STORAGE_KEY);
}

/**
 * Obtiene el último intento registrado para mostrar en la pantalla de resultados.
 */
export function getLastExamAttempt() {
  try {
    const raw = localStorage.getItem(LAST_ATTEMPT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error('Error al leer el último intento:', error);
    return null;
  }
}

/**
 * Evalúa las respuestas de un estudiante y guarda el intento en localStorage.
 */
export function evaluateAndSaveExamAttempt({
  exam,
  student = {},
  answers = {},
  remainingSeconds = 0,
  autoSubmittedByTimeout = false
} = {}) {
  const normalizedExam = normalizeExamSchema(exam);
  const questions = Array.isArray(normalizedExam.questions) ? normalizedExam.questions : [];
  const totalQuestions = questions.length;

  let correctCount = 0;

  const evaluatedQuestions = questions.map((q, idx) => {
    const selectedOptionId = answers[q.id] ?? null;
    const selectedOption =
      (q.options ?? []).find((opt) => String(opt.id) === String(selectedOptionId)) ?? null;
    const correctOption = (q.options ?? []).find((opt) => Boolean(opt.isCorrect)) ?? null;
    const isCorrect = Boolean(selectedOption && selectedOption.isCorrect);

    if (isCorrect) {
      correctCount += 1;
    }

    return {
      questionId: q.id,
      questionNumber: q.number ?? idx + 1,
      statement: q.statement ?? '',
      selectedOptionId,
      selectedOptionText: selectedOption?.text ?? 'Sin responder',
      correctOptionId: correctOption?.id ?? null,
      correctOptionText: correctOption?.text ?? '',
      isCorrect
    };
  });

  const scorePercentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const approvalPercentage = Number(normalizedExam.approvalPercentage ?? 70);
  const passed = scorePercentage >= approvalPercentage;
  const safeRemainingSeconds = Math.max(0, Math.floor(Number(remainingSeconds) || 0));
  const formattedTime = formatHMS(safeRemainingSeconds);

  const attempt = {
    id: `attempt-${Date.now()}`,
    examId: normalizedExam.id,
    examCode: normalizedExam.code,
    examTitle: normalizedExam.title,
    studentName: String(student?.name ?? 'Estudiante').trim(),
    studentDocument: String(student?.document ?? '').trim(),
    correctCount,
    totalQuestions,
    scorePercentage,
    approvalPercentage,
    passed,
    status: passed ? 'Aprobado' : 'No aprobado',
    remainingSeconds: safeRemainingSeconds,
    remainingTimeFormatted: formattedTime.text,
    autoSubmittedByTimeout: Boolean(autoSubmittedByTimeout),
    answers: evaluatedQuestions,
    submittedAt: new Date().toISOString()
  };

  const attempts = getAllExamAttempts();
  attempts.push(attempt);
  writeJson(ATTEMPTS_STORAGE_KEY, attempts);
  writeJson(LAST_ATTEMPT_STORAGE_KEY, attempt);

  return attempt;
}

/**
 * Obtiene la lista de claves de exámenes marcados como hechos.
 */
export function getCompletedExamsList() {
  return readArray(COMPLETED_EXAMS_STORAGE_KEY);
}

function buildCompletionKey(examId, studentDocument = '') {
  const docPart = String(studentDocument ?? '').trim() || 'public';
  return `${docPart}::${String(examId ?? '')}`;
}

/**
 * Marca un examen como hecho para el estudiante/sesión actual.
 */
export function markExamCompletedByStudent(examId, studentDocument = '') {
  const completed = getCompletedExamsList();
  const key = buildCompletionKey(examId, studentDocument);
  if (!completed.includes(key)) {
    completed.push(key);
    writeJson(COMPLETED_EXAMS_STORAGE_KEY, completed);
  }
  return completed;
}

/**
 * Verifica si un examen ya está marcado como hecho.
 */
export function isExamCompletedByStudent(examId, studentDocument = '') {
  const completed = getCompletedExamsList();
  const docKey = buildCompletionKey(examId, studentDocument);
  const publicKey = buildCompletionKey(examId, '');
  return completed.includes(docKey) || completed.includes(publicKey);
}
