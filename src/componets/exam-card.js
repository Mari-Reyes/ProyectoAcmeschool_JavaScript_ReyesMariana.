/**
 * Componente: src/componets/exam-card.js
 * Construye y actualiza tarjetas de examen para la vista de estudiantes
 * y para el módulo de gestión de exámenes.
 */

function createManualSlot(slotName) {
  const span = document.createElement('span');
  span.className = 'manual-icon';
  span.dataset.slot = slotName;
  return span;
}

function formatDurationMinutes(exam) {
  if (typeof exam?.durationMinutes === 'number' && Number.isFinite(exam.durationMinutes)) {
    return `${exam.durationMinutes} MIN`;
  }
  if (typeof exam?.durationLabel === 'string' && exam.durationLabel.trim()) {
    return exam.durationLabel.trim();
  }
  const h = Number(exam?.duration?.hours ?? 0);
  const m = Number(exam?.duration?.minutes ?? 0);
  const totalMinutes = h * 60 + m;
  return `${totalMinutes > 0 ? totalMinutes : 30} MIN`;
}

/**
 * Crea una tarjeta DOM para la vista pública de estudiantes.
 * @param {Object} exam - Datos del examen.
 * @param {Object} options - { isCompleted: boolean, isLocked: boolean, onStart: fn, onViewResult: fn }
 */
export function createStudentExamCard(exam, options = {}) {
  const {
    isCompleted = false,
    isLocked = false,
    onStart = null,
    onViewResult = null
  } = options;

  const article = document.createElement('article');
  article.className = 'student-exam-card';
  article.dataset.examId = String(exam?.id ?? '');
  article.dataset.examCode = String(exam?.code ?? '');
  article.dataset.completed = String(Boolean(isCompleted));
  article.dataset.locked = String(Boolean(isLocked));

  if (isCompleted) {
    article.classList.add('is-completed');
  }
  if (isLocked) {
    article.classList.add('is-locked');
  }

  // Cuerpo izquierdo: código, título, descripción y acción principal
  const body = document.createElement('div');
  body.className = 'student-exam-card__body';

  const codeEl = document.createElement('span');
  codeEl.className = 'student-exam-card__code';
  codeEl.dataset.field = 'code';
  codeEl.textContent = exam?.code ?? 'Código exámen';

  const titleEl = document.createElement('h3');
  titleEl.className = 'student-exam-card__title';
  titleEl.dataset.field = 'name';
  titleEl.textContent = exam?.title ?? exam?.name ?? 'Nombre del exámen';

  const descEl = document.createElement('p');
  descEl.className = 'student-exam-card__description';
  descEl.dataset.field = 'description';
  descEl.textContent =
    exam?.description ??
    'Breve explicación del contenido, tema o instrucciones generales de la prueba';

  const actionBtn = document.createElement('button');
  actionBtn.type = 'button';
  actionBtn.className = 'btn-start-exam';
  actionBtn.dataset.action = isCompleted ? 'view-result' : 'start-exam';
  actionBtn.disabled = Boolean(isLocked && !isCompleted);

  if (isCompleted) {
    actionBtn.textContent = 'Ver resultado';
    actionBtn.addEventListener('click', () => {
      if (typeof onViewResult === 'function') onViewResult(exam);
    });
  } else {
    actionBtn.textContent = isLocked ? 'Examen bloqueado' : 'Presentar examen';
    actionBtn.addEventListener('click', () => {
      if (!isLocked && typeof onStart === 'function') onStart(exam);
    });
  }

  body.append(codeEl, titleEl, descEl, actionBtn);

  // Columna derecha: duración, porcentaje de aprobación y estado completado/bloqueado
  const aside = document.createElement('aside');
  aside.className = 'student-exam-card__aside';

  const durationBox = document.createElement('div');
  durationBox.className = 'exam-duration';

  const durationText = document.createElement('div');
  durationText.className = 'exam-duration__text';

  const durationLabel = document.createElement('span');
  durationLabel.className = 'exam-duration__label';
  durationLabel.textContent = 'Duración del exámen';

  const durationValue = document.createElement('strong');
  durationValue.className = 'exam-duration__value';
  durationValue.dataset.field = 'duration';
  durationValue.textContent = formatDurationMinutes(exam);

  durationText.append(durationLabel, durationValue);
  durationBox.append(durationText, createManualSlot('clock-icon'));

  const approvalBox = document.createElement('div');
  approvalBox.className = 'exam-approval';
  approvalBox.dataset.field = 'approval';
  const approvalPct = Number(exam?.approvalPercentage ?? 70);
  approvalBox.textContent = `Porcentaje aprobación: ${approvalPct}%`;

  const statusBadge = document.createElement('div');
  statusBadge.className = 'exam-completion-status';
  statusBadge.dataset.status = isCompleted ? 'completed' : isLocked ? 'locked' : 'available';

  const lockSlot = createManualSlot('lock-icon');
  const statusText = document.createElement('span');
  statusText.className = 'exam-completion-status__text';

  if (isCompleted) {
    statusText.textContent = 'Marcado como hecho';
  } else if (isLocked) {
    statusText.textContent = 'Bloqueado';
  } else {
    statusText.textContent = 'Disponible';
  }

  statusBadge.append(lockSlot, statusText);
  aside.append(durationBox, approvalBox, statusBadge);

  article.append(body, aside);
  return article;
}

/**
 * Crea una tarjeta DOM para la página principal de Gestión de exámenes.
 * Incluye: Código, Nombre, Breve explicación, Duración, Porcentaje aprobación
 * y los botones "Ver exámen", "Editar exámen" y "Eliminar exámen".
 * @param {Object} exam - Datos del examen.
 * @param {Object} handlers - { onView: fn, onEdit: fn, onDelete: fn }
 */
export function createManagementExamCard(exam, handlers = {}) {
  const { onView = null, onEdit = null, onDelete = null } = handlers;

  const article = document.createElement('article');
  article.className = 'mgmt-exam-card';
  article.dataset.examId = String(exam?.id ?? '');
  article.dataset.examCode = String(exam?.code ?? '');

  // Cuerpo izquierdo
  const body = document.createElement('div');
  body.className = 'mgmt-exam-card__body';

  const codeEl = document.createElement('span');
  codeEl.className = 'mgmt-exam-card__code';
  codeEl.dataset.field = 'code';
  codeEl.textContent = exam?.code ?? 'Código exámen';

  const nameEl = document.createElement('h3');
  nameEl.className = 'mgmt-exam-card__name';
  nameEl.dataset.field = 'name';
  nameEl.textContent = exam?.title ?? exam?.name ?? 'Nombre del exámen';

  const descEl = document.createElement('p');
  descEl.className = 'mgmt-exam-card__description';
  descEl.dataset.field = 'description';
  descEl.textContent =
    exam?.description ??
    'Breve explicación del contenido, tema o instrucciones generales de la prueba';

  const viewBtn = document.createElement('button');
  viewBtn.type = 'button';
  viewBtn.className = 'btn-view-exam';
  viewBtn.dataset.action = 'view-exam';
  viewBtn.dataset.gotoSection = 'view';
  viewBtn.textContent = 'Ver exámen';
  viewBtn.addEventListener('click', () => {
    if (typeof onView === 'function') onView(exam);
  });

  body.append(codeEl, nameEl, descEl, viewBtn);

  // Columna derecha
  const aside = document.createElement('aside');
  aside.className = 'mgmt-exam-card__aside';

  const durationBox = document.createElement('div');
  durationBox.className = 'exam-duration';

  const durationText = document.createElement('div');
  durationText.className = 'exam-duration__text';

  const durationLabel = document.createElement('span');
  durationLabel.className = 'exam-duration__label';
  durationLabel.textContent = 'Duración del exámen';

  const durationValue = document.createElement('strong');
  durationValue.className = 'exam-duration__value';
  durationValue.dataset.field = 'duration';
  durationValue.textContent = formatDurationMinutes(exam);

  durationText.append(durationLabel, durationValue);
  durationBox.append(durationText, createManualSlot('clock-icon'));

  const approvalBox = document.createElement('div');
  approvalBox.className = 'exam-approval';
  approvalBox.dataset.field = 'approval';
  const approvalPct = Number(exam?.approvalPercentage ?? 70);
  approvalBox.textContent = `Porcentaje aprobación: ${approvalPct}%`;

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-edit-exam';
  editBtn.dataset.action = 'edit-exam';
  editBtn.dataset.gotoSection = 'edit';
  editBtn.textContent = 'Editar exámen';
  editBtn.addEventListener('click', () => {
    if (typeof onEdit === 'function') onEdit(exam);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-delete-exam';
  deleteBtn.dataset.action = 'delete-exam';
  deleteBtn.dataset.gotoSection = 'delete';
  deleteBtn.textContent = 'Eliminar exámen';
  deleteBtn.addEventListener('click', () => {
    if (typeof onDelete === 'function') onDelete(exam);
  });

  aside.append(durationBox, approvalBox, editBtn, deleteBtn);
  article.append(body, aside);

  return article;
}

/**
 * Renderiza una lista de tarjetas dentro de un contenedor DOM.
 */
export function renderExamCardsList(containerElement, items = [], cardFactory) {
  if (!containerElement) return;
  containerElement.innerHTML = '';

  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const card = cardFactory(item);
    if (card) fragment.appendChild(card);
  });
  containerElement.appendChild(fragment);
}
