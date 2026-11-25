/**
 * Vista: src/modules/users/usersViews.js
 * Renderiza el listado de tarjetas de usuarios, el estado vacío de búsqueda
 * y la lectura/poblado de los formularios en los modales de detalle y creación.
 */

function createFieldRow(labelText, valueText, fieldKey) {
  const wrapper = document.createElement('div');
  wrapper.className = 'user-card__field';

  const label = document.createElement('span');
  label.className = 'user-card__label';
  label.textContent = labelText;

  const value = document.createElement('div');
  value.className = 'user-card__value';
  value.dataset.field = fieldKey;
  value.textContent = valueText ?? '';

  wrapper.append(label, value);
  return wrapper;
}

/**
 * Crea una tarjeta visual para un usuario registrado (sin contraseña visible).
 */
export function createUserCardElement(user = {}, { onSelectUser = null } = {}) {
  const card = document.createElement('article');
  card.className = 'user-card';
  card.tabIndex = 0;
  card.dataset.userId = String(user.id ?? '');
  card.setAttribute('aria-label', `Gestionar usuario ${user.name ?? ''}`.trim());

  card.append(
    createFieldRow('Nombre de usuario:', user.name ?? '', 'name'),
    createFieldRow('Número de documento:', user.document ?? '', 'document'),
    createFieldRow('Dirección correo:', user.email ?? '', 'email'),
    createFieldRow('Teléfono:', user.phone ?? '', 'phone'),
    createFieldRow('Cargo:', user.role ?? '', 'role')
  );

  const handleOpen = () => {
    if (typeof onSelectUser === 'function') {
      onSelectUser(user);
    }
  };

  card.addEventListener('click', handleOpen);
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  });

  return card;
}

/**
 * Renderiza todas las tarjetas de usuarios o muestra el estado vacío de búsqueda.
 */
export function renderUsersCardsList(
  users = [],
  { query = '', onSelectUser = null } = {}
) {
  const listContainer = document.getElementById('users-list');
  const emptyStateEl = document.getElementById('users-empty-state');
  const emptyMessageEl = document.getElementById('users-empty-message');

  if (!listContainer) return;

  listContainer.innerHTML = '';

  if (!Array.isArray(users) || users.length === 0) {
    if (emptyStateEl) {
      emptyStateEl.classList.remove('is-hidden');
    }
    if (emptyMessageEl) {
      const cleanQuery = String(query ?? '').trim();
      emptyMessageEl.textContent = cleanQuery
        ? `No se encontró ningún usuario con el nombre "${cleanQuery}". Verifica la ortografía o limpia el filtro para ver todos los registros.`
        : 'No hay usuarios registrados en este momento. Crea el primero desde "Crear nuevo usuario".';
    }
    return;
  }

  if (emptyStateEl) {
    emptyStateEl.classList.add('is-hidden');
  }

  users.forEach((user) => {
    listContainer.appendChild(createUserCardElement(user, { onSelectUser }));
  });
}

/**
 * Carga los datos del usuario seleccionado en el modal de detalle/edición.
 */
export function populateUserDetailModal(user = {}) {
  const nameInput = document.getElementById('detail-user-name');
  const docInput = document.getElementById('detail-user-document');
  const emailInput = document.getElementById('detail-user-email');
  const phoneInput = document.getElementById('detail-user-phone');
  const roleInput = document.getElementById('detail-user-role');
  const passwordInput = document.getElementById('detail-user-password');

  if (nameInput) nameInput.value = user.name ?? '';
  if (docInput) docInput.value = user.document ?? '';
  if (emailInput) emailInput.value = user.email ?? '';
  if (phoneInput) phoneInput.value = user.phone ?? '';
  if (roleInput) roleInput.value = user.role ?? '';
  if (passwordInput) passwordInput.value = user.password ?? '';
}

/**
 * Lee los valores del formulario de detalle/edición de usuario.
 */
export function getDetailUserFormData() {
  return {
    name: document.getElementById('detail-user-name')?.value ?? '',
    document: document.getElementById('detail-user-document')?.value ?? '',
    email: document.getElementById('detail-user-email')?.value ?? '',
    phone: document.getElementById('detail-user-phone')?.value ?? '',
    role: document.getElementById('detail-user-role')?.value ?? '',
    password: document.getElementById('detail-user-password')?.value ?? ''
  };
}

/**
 * Lee los valores del formulario para crear un nuevo usuario.
 */
export function getCreateUserFormData() {
  return {
    name: document.getElementById('create-user-name')?.value ?? '',
    document: document.getElementById('create-user-document')?.value ?? '',
    email: document.getElementById('create-user-email')?.value ?? '',
    phone: document.getElementById('create-user-phone')?.value ?? '',
    role: document.getElementById('create-user-role')?.value ?? '',
    password: document.getElementById('create-user-password')?.value ?? ''
  };
}

/**
 * Limpia los campos del formulario de creación de usuario.
 */
export function clearCreateUserForm() {
  const form = document.getElementById('create-user-form');
  if (form) {
    form.reset();
  }
}

/**
 * Actualiza el título del modal de éxito de usuarios.
 */
export function setUserSuccessModalTitle(titleText) {
  const titleEl = document.getElementById('user-success-title');
  if (titleEl && titleText) {
    titleEl.textContent = titleText;
  }
}
