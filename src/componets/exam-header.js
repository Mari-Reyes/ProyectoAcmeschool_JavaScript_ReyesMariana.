/**
 * Componente: src/componets/exam-header.js
 * Sincroniza encabezados, metadatos de examen, contador de preguntas,
 * porcentaje de aprobación y datos del usuario/estudiante en las vistas.
 */

function setText(selectorOrElement, value) {
  const el =
    typeof selectorOrElement === 'string'
      ? document.querySelector(selectorOrElement)
      : selectorOrElement;
  if (el) {
    el.textContent = value;
  }
}

/**
 * Actualiza los encabezados y datos de contexto para la vista del estudiante
 * (registro del examen y visualización/resolución del examen).
 * @param {Object} params - { exam, student, totalQuestions }
 */
export function renderStudentExamHeader({ exam = {}, student = null, totalQuestions = null } = {}) {
  const examTitle = exam?.title ?? exam?.name ?? 'Nombre del examen';
  const examCode = exam?.code ?? '';
  const approvalPercentage = Number(exam?.approvalPercentage ?? 70);
  const questionCount =
    typeof totalQuestions === 'number'
      ? totalQuestions
      : Array.isArray(exam?.questions)
        ? exam.questions.length
        : Number(exam?.questionCount ?? 0);

  // Nombre del examen en registro y en visualización/resolución
  document.querySelectorAll('[data-exam-title]').forEach((el) => {
    el.textContent = examTitle;
  });

  if (examCode) {
    document.querySelectorAll('[data-exam-code]').forEach((el) => {
      el.textContent = examCode;
    });
  }

  // Cantidad de preguntas
  setText('#exam-total-questions', String(questionCount));
  setText('#preview-total-questions', String(questionCount));
  setText('#runner-total-questions', String(questionCount));
  setText('.status-box--questions .status-box__value', String(questionCount));
  document.querySelectorAll('[data-total-questions]').forEach((el) => {
    el.textContent = String(questionCount);
  });


  // Porcentaje de aprobación
  const approvalText = `Porcentaje aprobación: ${approvalPercentage}%`;
  setText('#exam-approval-badge', approvalText);
  setText('#preview-approval', approvalText);
  setText('#edit-approval', approvalText);
  document.querySelectorAll('[data-required-percentage]').forEach((el) => {
    el.textContent = `${approvalPercentage}%`;
  });

  // Datos del estudiante registrado (no editables durante el examen ni en resultados)
  if (student) {
    const studentName = String(student.name ?? '').trim();
    const studentDoc = String(student.document ?? '').trim();

    document.querySelectorAll('[data-student-name]').forEach((el) => {
      if ('value' in el && el.tagName === 'INPUT') {
        el.value = studentName;
      } else {
        el.textContent = studentName;
      }
    });

    document.querySelectorAll('[data-student-id]').forEach((el) => {
      if ('value' in el && el.tagName === 'INPUT') {
        el.value = studentDoc;
      } else {
        el.textContent = studentDoc;
      }
    });
  }
}

/**
 * Actualiza el saludo del usuario autenticado ("Hola, [Usuario]") en las secciones
 * de modificación y creación de exámenes.
 * @param {Object|string|null} sessionOrUserName
 */
export function renderAuthenticatedUserGreeting(sessionOrUserName) {
  const userName =
    typeof sessionOrUserName === 'string'
      ? sessionOrUserName.trim()
      : String(sessionOrUserName?.name ?? '').trim();

  const displayName = userName || 'Usuario';

  document.querySelectorAll('[data-logged-user]').forEach((el) => {
    el.textContent = displayName;
  });

  document.querySelectorAll('[data-logged-user-name]').forEach((el) => {
    el.textContent = displayName;
  });
}

/**
 * Actualiza los contadores de preguntas en los modos de editar y crear examen.
 * @param {number} count
 */
export function updateQuestionCounter(count) {
  const safeCount = Math.max(0, Number(count) || 0);
  setText('#edit-total-questions', String(safeCount));
  setText('#create-questions-registered', String(safeCount));
  setText('#exam-total-questions', String(safeCount));
}

/**
 * Sincroniza los campos superiores del formulario de edición de examen
 * manteniendo el código como no modificable.
 * @param {Object} exam
 */
export function populateEditExamHeader(exam = {}) {
  const codeInput = document.getElementById('edit-exam-code');
  const titleInput = document.getElementById('edit-exam-title');
  const descInput = document.getElementById('edit-exam-description');
  const approvalEl = document.getElementById('edit-approval');

  if (codeInput) {
    codeInput.value = exam?.code ?? '';
    codeInput.readOnly = true;
    codeInput.disabled = true;
  }

  if (titleInput) {
    titleInput.value = exam?.title ?? exam?.name ?? '';
  }

  if (descInput) {
    descInput.value = exam?.description ?? '';
  }

  if (approvalEl) {
    const pct = Number(exam?.approvalPercentage ?? 70);
    approvalEl.textContent = `Porcentaje aprobación: ${pct}%`;
  }

  const count = Array.isArray(exam?.questions) ? exam.questions.length : 0;
  updateQuestionCounter(count);
}

export function bindLogoutAction({ onLogout = null } = {}) {
  const confirmLogoutBtn =
    document.getElementById('btn-confirm-logout') ||
    document.querySelector('[data-action="confirm-logout"]');

  if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof onLogout === 'function') {
        onLogout();
      }
    });
  }
}

