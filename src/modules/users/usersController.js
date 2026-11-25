/**
 * Controlador: src/modules/users/usersController.js
 * Coordina el acceso autenticado, la persistencia en localStorage, la búsqueda,
 * la creación, actualización y eliminación de usuarios en Gestión de usuarios.
 */

import { getActiveSession } from '../../auth/authService.js';
import {
  closeModal,
  openModal,
  setAlertMessage,
  showToast
} from '../../componets/toast-alert.js';
import {
  capitalizeAfterPeriodOrNewline,
  validateUserSchema
} from '../../data/shema.js';
import {
  clearCreateUserForm,
  getCreateUserFormData,
  getDetailUserFormData,
  populateUserDetailModal,
  renderUsersCardsList,
  setUserSuccessModalTitle
} from './usersViews.js';

const USERS_STORAGE_KEY = 'acme_school_users_v1';

export function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al cargar usuarios desde localStorage:', error);
    return [];
  }
}

export function saveUsersToStorage(users = []) {
  try {
    const list = Array.isArray(users) ? users : [];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (error) {
    console.error('Error al guardar usuarios en localStorage:', error);
    return false;
  }
}

export function filterUsersByName(users = [], query = '') {
  const term = String(query ?? '').trim().toLowerCase();
  if (!term) return Array.isArray(users) ? [...users] : [];

  return (Array.isArray(users) ? users : []).filter((user) => {
    const name = String(user?.name ?? '').toLowerCase();
    const email = String(user?.email ?? '').toLowerCase();
    const doc = String(user?.document ?? '').toLowerCase();
    return name.includes(term) || email.includes(term) || doc.includes(term);
  });
}

function normalizeUserRecord(raw = {}, existingUser = null) {
  const passwordInput = String(raw.password ?? '').trim();
  const resolvedPassword =
    passwordInput.length > 0 ? passwordInput : String(existingUser?.password ?? '');

  return {
    id: existingUser?.id ?? raw.id ?? `usr-${Date.now()}`,
    name: capitalizeAfterPeriodOrNewline(String(raw.name ?? '').trim()),
    document: String(raw.document ?? '').trim(),
    email: String(raw.email ?? '').trim().toLowerCase(),
    phone: String(raw.phone ?? '').trim(),
    role: capitalizeAfterPeriodOrNewline(String(raw.role ?? '').trim()),
    password: resolvedPassword,
    isPrimaryAdmin: Boolean(existingUser?.isPrimaryAdmin ?? raw.isPrimaryAdmin ?? false)
  };
}

export function initUsersController({
  onRequireAuth = null
} = {}) {
  const session = getActiveSession();
  if (!session) {
    if (typeof onRequireAuth === 'function') {
      onRequireAuth();
    } else {
      window.location.href = 'index.html';
    }
    return null;
  }

  let allUsers = loadUsersFromStorage();
  let selectedUser = null;
  let pendingEditCandidate = null;

  const searchInput = document.getElementById('input-search-user-name');
  const searchBtn = document.getElementById('btn-search-user');
  const openCreateBtn = document.getElementById('btn-open-create-user');
  const createForm = document.getElementById('create-user-form');

  const updateUserBtn = document.getElementById('btn-update-user');
  const deleteUserBtn = document.getElementById('btn-delete-user');
  const confirmSaveUserBtn = document.getElementById('btn-confirm-save-user');
  const cancelSaveUserBtn = document.getElementById('btn-cancel-save-user');
  const confirmDeleteUserBtn = document.getElementById('btn-confirm-delete-user');
  const returnUsersPageBtn = document.getElementById('btn-return-users-page');

  function refreshUsersView(query = searchInput?.value ?? '') {
    const filtered = filterUsersByName(allUsers, query);
    renderUsersCardsList(filtered, {
      query,
      onSelectUser: (user) => {
        selectedUser = { ...user };
        pendingEditCandidate = null;
        populateUserDetailModal(selectedUser);
        openModal('modal-user-detail');
      }
    });
  }

  // Apertura modal crear usuario
  if (openCreateBtn) {
    openCreateBtn.addEventListener('click', () => {
      clearCreateUserForm();
      openModal('modal-create-user');
    });
  }

  // Búsqueda por nombre / correo / documento
  if (searchInput) {
    const originalPlaceholder = searchInput.getAttribute('placeholder') || 'Buscar usuario...';
    const searchingPlaceholder =
      searchInput.dataset.searchingPlaceholder || 'Buscando usuario...';

    searchInput.addEventListener('focus', () => {
      searchInput.setAttribute('placeholder', searchingPlaceholder);
    });

    searchInput.addEventListener('blur', () => {
      if (!searchInput.value.trim()) {
        searchInput.setAttribute('placeholder', originalPlaceholder);
      }
    });

    searchInput.addEventListener('input', () => {
      refreshUsersView(searchInput.value);
    });
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
      refreshUsersView(searchInput.value);
    });
  }

  // Crear nuevo usuario
  if (createForm) {
    createForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const rawData = getCreateUserFormData();
      const candidate = normalizeUserRecord(rawData, null);
      const validation = validateUserSchema(candidate);

      const duplicateDoc = allUsers.some(
        (u) => String(u.document).trim() === candidate.document
      );
      const duplicateEmail = allUsers.some(
        (u) => String(u.email).trim().toLowerCase() === candidate.email
      );

      if (!validation.valid || duplicateDoc || duplicateEmail) {
        const errorMessage = duplicateDoc
          ? 'Ya existe un usuario registrado con ese número de documento.'
          : duplicateEmail
            ? 'Ya existe un usuario registrado con ese correo institucional.'
            : 'Revisa que la información que escribiste cumple con las validaciones.';

        setAlertMessage({
          modalId: 'modal-user-error',
          messageSelector: '#modal-user-error-message',
          message: errorMessage,
          open: true
        });
        return;
      }

      allUsers.push(candidate);
      saveUsersToStorage(allUsers);
      closeModal('modal-create-user');
      clearCreateUserForm();
      refreshUsersView(searchInput?.value ?? '');
      setUserSuccessModalTitle('Usuario creado correctamente');
      openModal('modal-user-success');
      showToast('Usuario creado correctamente', { type: 'success' });
    });
  }

  // Solicitar confirmación para guardar cambios al actualizar usuario
  if (updateUserBtn) {
    updateUserBtn.addEventListener('click', () => {
      if (!selectedUser) return;

      const formValues = getDetailUserFormData();
      const candidate = normalizeUserRecord(formValues, selectedUser);
      const validation = validateUserSchema(candidate);

      const duplicateDoc = allUsers.some(
        (u) => u.id !== selectedUser.id && String(u.document).trim() === candidate.document
      );
      const duplicateEmail = allUsers.some(
        (u) =>
          u.id !== selectedUser.id &&
          String(u.email).trim().toLowerCase() === candidate.email
      );

      if (!validation.valid || duplicateDoc || duplicateEmail) {
        setAlertMessage({
          modalId: 'modal-user-error',
          messageSelector: '#modal-user-error-message',
          message:
            'Revisa que la información que escribiste cumple con las validaciones.',
          open: true
        });
        return;
      }

      pendingEditCandidate = candidate;
      openModal('modal-confirm-save-user');
    });
  }

  if (cancelSaveUserBtn) {
    cancelSaveUserBtn.addEventListener('click', () => {
      pendingEditCandidate = null;
      closeModal('modal-confirm-save-user');
    });
  }

  if (confirmSaveUserBtn) {
    confirmSaveUserBtn.addEventListener('click', () => {
      if (!pendingEditCandidate) return;

      allUsers = allUsers.map((u) =>
        u.id === pendingEditCandidate.id ? pendingEditCandidate : u
      );
      selectedUser = { ...pendingEditCandidate };
      pendingEditCandidate = null;

      saveUsersToStorage(allUsers);
      closeModal('modal-confirm-save-user');
      closeModal('modal-user-detail');
      refreshUsersView(searchInput?.value ?? '');
      setUserSuccessModalTitle('Cambios guardados correctamente');
      openModal('modal-user-success');
      showToast('Cambios guardados correctamente', { type: 'success' });
    });
  }

  // Solicitar confirmación para eliminar usuario
  if (deleteUserBtn) {
    deleteUserBtn.addEventListener('click', () => {
      if (!selectedUser) return;
      openModal('modal-confirm-delete-user');
    });
  }

  if (confirmDeleteUserBtn) {
    confirmDeleteUserBtn.addEventListener('click', () => {
      if (!selectedUser) return;

      const targetId = selectedUser.id;
      allUsers = allUsers.filter((u) => u.id !== targetId);
      selectedUser = null;

      saveUsersToStorage(allUsers);
      closeModal('modal-confirm-delete-user');
      closeModal('modal-user-detail');
      refreshUsersView(searchInput?.value ?? '');
      setUserSuccessModalTitle('Usuario eliminado correctamente');
      openModal('modal-user-success');
      showToast('Usuario eliminado correctamente', { type: 'success' });
    });
  }

  if (returnUsersPageBtn) {
    returnUsersPageBtn.addEventListener('click', () => {
      closeModal('modal-user-success');
      refreshUsersView(searchInput?.value ?? '');
    });
  }

  refreshUsersView('');

  return {
    refresh: () => {
      allUsers = loadUsersFromStorage();
      refreshUsersView(searchInput?.value ?? '');
    }
  };
}
