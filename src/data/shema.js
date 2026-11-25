/**
 * Esquemas y validaciones: src/data/shema.js
 * Define la estructura normalizada y las reglas de validación para Usuarios,
 * Estudiantes, Exámenes, Preguntas, Opciones e Intentos de Acme School.
 */

export const ALLOWED_ROLES = Object.freeze(['Docente', 'Administrador']);
export const INSTITUTIONAL_DOMAIN = '@acmeschool.edu';

/**
 * Normaliza mayúsculas al inicio de cada palabra después de un punto (.)
 * o un salto de línea (\n), conservando el resto del texto sin romper puntuaciones.
 */
export function capitalizeAfterPeriodOrNewline(rawText) {
  const text = String(rawText ?? '');
  if (!text) return '';

  // Capitaliza la primera letra al inicio o tras '.' o '\n',
  // y también al inicio de cada palabra inmediatamente posterior a '.' o '\n'.
  return text.replace(
    /(^|[.\n]+\s*)([a-záéíóúüñ])/giu,
    (_match, prefix, firstChar) => `${prefix}${firstChar.toUpperCase()}`
  );
}

/**
 * Valida nombre/apellido: solo letras (incluye tildes y ñ) y espacios,
 * sin números ni símbolos especiales.
 */
export function isValidPersonName(value) {
  const trimmed = String(value ?? '').trim();
  if (!trimmed) return false;
  // Al menos 2 palabras (nombre y apellido), máximo 4 (hasta 2 nombres y 2 apellidos)
  const parts = trimmed.split(/\s+/);
  if (parts.length < 2 || parts.length > 4) return false;
  return /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+){1,3}$/.test(trimmed);
}

/**
 * Valida número de documento/identificación: solo dígitos numéricos.
 */
export function isValidDocumentNumber(value) {
  const cleaned = String(value ?? '').trim();
  return /^\d{5,15}$/.test(cleaned);
}

/**
 * Valida correo institucional con dominio @acmeschool.edu.
 */
export function isValidInstitutionalEmail(value) {
  const email = String(value ?? '').trim().toLowerCase();
  if (!email.endsWith(INSTITUTIONAL_DOMAIN)) return false;
  return /^[a-z0-9._-]+@acmeschool\.edu$/.test(email);
}

/**
 * Valida teléfono: exactamente 10 dígitos numéricos.
 */
export function isValidPhoneNumber(value) {
  const digits = String(value ?? '').trim();
  return /^\d{10}$/.test(digits);
}

/**
 * Valida contraseña según reglas de Acme School:
 * - Entre 8 y 12 caracteres
 * - Al menos 1 mayúscula
 * - Al menos 1 minúscula
 * - Al menos 1 número
 * - Al menos 1 punto (.)
 */
export function isValidPassword(value) {
  const pwd = String(value ?? '');
  if (pwd.length < 8 || pwd.length > 12) return false;
  const hasUpper = /[A-ZÁÉÍÓÚÜÑ]/.test(pwd);
  const hasLower = /[a-záéíóúüñ]/.test(pwd);
  const hasDigit = /\d/.test(pwd);
  const hasDot = /\./.test(pwd);
  return hasUpper && hasLower && hasDigit && hasDot;
}

/**
 * Valida un objeto de usuario y devuelve { valid, errors }.
 */
export function validateUserSchema(user = {}) {
  const errors = {};

  if (!isValidPersonName(user.name)) {
    errors.name =
      'Ingresa nombre y apellido válidos (solo letras y espacios, sin números ni símbolos).';
  }
  if (!isValidDocumentNumber(user.document)) {
    errors.document = 'El número de documento debe contener solo dígitos numéricos.';
  }
  if (!isValidInstitutionalEmail(user.email)) {
    errors.email = 'El correo debe pertenecer al dominio institucional @acmeschool.edu.';
  }
  if (!isValidPhoneNumber(user.phone)) {
    errors.phone = 'El teléfono debe tener exactamente 10 dígitos numéricos.';
  }
  if (!ALLOWED_ROLES.includes(String(user.role ?? '').trim())) {
    errors.role = 'Selecciona un cargo válido (Docente o Administrador).';
  }
  if (!isValidPassword(user.password)) {
    errors.password =
      'La contraseña debe tener entre 8 y 12 caracteres e incluir mayúscula, minúscula, número y un punto (.).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Normaliza una opción de respuesta.
 */
export function normalizeOptionSchema(option = {}, index = 0) {
  return {
    id: String(option.id ?? `opt-${index}`),
    text: capitalizeAfterPeriodOrNewline(String(option.text ?? '').trim()),
    isCorrect: Boolean(option.isCorrect)
  };
}

/**
 * Normaliza una pregunta con sus 4 opciones de respuesta.
 */
export function normalizeQuestionSchema(question = {}, index = 0) {
  const number = Number(question.number ?? index + 1) || index + 1;
  const rawOptions = Array.isArray(question.options) ? question.options : [];
  const paddedOptions = Array.from({ length: 4 }, (_, i) =>
    normalizeOptionSchema(rawOptions[i] ?? { text: '', isCorrect: i === 0 }, i)
  );

  // Garantiza que exista al menos una respuesta marcada como correcta si se indicó
  const correctCount = paddedOptions.filter((o) => o.isCorrect).length;
  if (correctCount === 0 && rawOptions.some((o) => o?.isCorrect)) {
    paddedOptions[0].isCorrect = true;
  }

  const rawTitle = String(question.title ?? `Pregunta ${number}`).trim();
  return {
    id: String(question.id ?? `q-${Date.now()}-${index + 1}`),
    number,
    title: capitalizeAfterPeriodOrNewline(rawTitle),
    statement: capitalizeAfterPeriodOrNewline(String(question.statement ?? '').trim()),
    options: paddedOptions
  };
}

/**
 * Normaliza un examen completo según el esquema de Acme School.
 */
export function normalizeExamSchema(exam = {}) {
  const durationMinutes = Math.max(
    1,
    Number(exam.durationMinutes ?? (exam.durationSeconds ? Math.ceil(exam.durationSeconds / 60) : 30)) || 30
  );
  const durationSeconds =
    typeof exam.durationSeconds === 'number' && exam.durationSeconds >= 0
      ? Math.floor(exam.durationSeconds)
      : durationMinutes * 60;

  const questions = (Array.isArray(exam.questions) ? exam.questions : []).map((q, idx) =>
    normalizeQuestionSchema({ ...q, number: idx + 1 }, idx)
  );

  return {
    id: String(exam.id ?? `exam-${Date.now()}`),
    code: String(exam.code ?? '').trim().toUpperCase(),
    title: capitalizeAfterPeriodOrNewline(String(exam.title ?? exam.name ?? '').trim()),
    description: capitalizeAfterPeriodOrNewline(String(exam.description ?? '').trim()),
    durationMinutes,
    durationSeconds,
    approvalPercentage: Number(exam.approvalPercentage ?? 70) || 70,
    questions
  };
}

/**
 * Valida un examen antes de guardarlo (crear o modificar).
 */
export function validateExamSchema(exam = {}, { requireUniqueCodeCheck = null } = {}) {
  const errors = {};
  const code = String(exam.code ?? '').trim();
  const title = String(exam.title ?? exam.name ?? '').trim();
  const description = String(exam.description ?? '').trim();
  const durationSeconds = Number(exam.durationSeconds ?? 0);
  const questions = Array.isArray(exam.questions) ? exam.questions : [];

  if (!code) {
    errors.code = 'El código del examen es obligatorio.';
  } else if (typeof requireUniqueCodeCheck === 'function' && requireUniqueCodeCheck(code)) {
    errors.code = 'Ya existe un examen registrado con este código.';
  }

  if (!title) {
    errors.title = 'El nombre del examen es obligatorio.';
  }

  if (!description) {
    errors.description = 'La breve explicación o instrucciones del examen son obligatorias.';
  }

  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    errors.duration = 'Debes configurar una duración válida mayor a 0 segundos.';
  }

  if (questions.length === 0) {
    errors.questions = 'Debes registrar al menos una pregunta en el examen.';
  } else {
    questions.forEach((q, idx) => {
      const qTitle = String(q.title ?? '').trim();
      const qStmt = String(q.statement ?? '').trim();
      const opts = Array.isArray(q.options) ? q.options : [];
      const allOptsFilled = opts.length === 4 && opts.every((o) => String(o.text ?? '').trim().length > 0);
      const hasCorrect = opts.some((o) => Boolean(o.isCorrect));

      if (!qTitle || !qStmt || !allOptsFilled || !hasCorrect) {
        errors[`question_${idx + 1}`] =
          `La pregunta #${idx + 1} debe tener título, enunciado, las 4 opciones completas y una respuesta correcta seleccionada.`;
      }
    });
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}
