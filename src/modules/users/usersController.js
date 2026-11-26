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

  const rawRole = String(raw.role ?? existingUser?.role ?? '').trim();
  const normalizedRole = rawRole
    ? rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase()
    : '';

  return {
    id: existingUser?.id ?? raw.id ?? `usr-${Date.now()}`,
    name: capitalizeAfterPeriodOrNewline(String(raw.name ?? '').trim()),
    document: String(raw.document ?? '').trim(),
    email: String(raw.email ?? '').trim().toLowerCase(),
    phone: String(raw.phone ?? existingUser?.phone ?? '').trim(),
    role: normalizedRole,
    password: resolvedPassword,
    isPrimaryAdmin: Boolean(existingUser?.isPrimaryAdmin ?? raw.isPrimaryAdmin ?? false)
  };
}

function formatRoleInput(rawRole, fallbackRole = '') {
  const clean = String(rawRole ?? fallbackRole ?? '').trim();
  if (!clean) return '';
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

function applyModalFieldValidationStates(fieldMap = {}, errors = {}) {
  Object.entries(fieldMap).forEach(([fieldKey, inputEl]) => {
    if (!inputEl) return;
    const container = inputEl.closest('.modal-field') || inputEl.parentElement;
    const hasError = Boolean(errors && errors[fieldKey]);

    inputEl.classList.toggle('is-invalid', hasError);
    if (container) {
      container.classList.toggle('is-invalid', hasError);
      container.setAttribute('data-field-status', hasError ? 'invalid' : 'valid');
    }
  });
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
  if (allUsers.length === 0 && session) {
    const fallbackUser = normalizeUserRecord(
      {
        id: session.userId ?? session.id ?? 'usr-session-001',
        name: session.name ?? 'Laura Sofia Mendoza Rios',
        document: session.document ?? '1098765432',
        email: session.email ?? 'laura.mendoza@acmeschool.edu',
        phone: session.phone ?? '3004128890',
        role: session.role ?? 'Administrador',
        password: session.password ?? 'AdminAcme.2026'
      },
      null
    );
    allUsers = [fallbackUser];
    saveUsersToStorage(allUsers);
  }

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

  const createFieldMap = {
    name: document.getElementById('create-user-name'),
    document: document.getElementById('create-user-document'),
    email: document.getElementById('create-user-email'),
    phone: document.getElementById('create-user-phone'),
    role: document.getElementById('create-user-role'),
    password: document.getElementById('create-user-password')
  };

  const detailFieldMap = {
    name: document.getElementById('detail-user-name'),
    document: document.getElementById('detail-user-document'),
    email: document.getElementById('detail-user-email'),
    phone: document.getElementById('detail-user-phone'),
    role: document.getElementById('detail-user-role'),
    password: document.getElementById('detail-user-password')
  };

  // Limpia estados inválidos al escribir nuevamente en un campo
  Object.values(createFieldMap).forEach((inputEl) => {
    inputEl?.addEventListener('input', () => {
      inputEl.classList.remove('is-invalid');
      const wrapper = inputEl.closest('.modal-field');
      wrapper?.classList.remove('is-invalid');
      wrapper?.setAttribute('data-field-status', 'valid');
    });
  });

  Object.values(detailFieldMap).forEach((inputEl) => {
    inputEl?.addEventListener('input', () => {
      inputEl.classList.remove('is-invalid');
      const wrapper = inputEl.closest('.modal-field');
      wrapper?.classList.remove('is-invalid');
      wrapper?.setAttribute('data-field-status', 'valid');
    });
  });

  function refreshUsersView(query = searchInput?.value ?? '') {
    const filtered = filterUsersByName(allUsers, query);
    renderUsersCardsList(filtered, {
      query,
      onSelectUser: (user) => {
        selectedUser = { ...user };
        pendingEditCandidate = null;
        applyModalFieldValidationStates(detailFieldMap, {});
        populateUserDetailModal(selectedUser);
        openModal('modal-user-detail');
      }
    });
  }

  // Apertura modal crear usuario
  if (openCreateBtn) {
    openCreateBtn.addEventListener('click', () => {
      clearCreateUserForm();
      applyModalFieldValidationStates(createFieldMap, {});
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
      const candidate = normalizeUserRecord(
        {
          ...rawData,
          role: formatRoleInput(rawData.role)
        },
        null
      );
      const validation = validateUserSchema(candidate);

      const duplicateDoc = allUsers.some(
        (u) => String(u.document ?? '').trim() === candidate.document
      );
      const duplicateEmail = allUsers.some(
        (u) => String(u.email ?? '').trim().toLowerCase() === candidate.email
      );

      if (!validation.valid || duplicateDoc || duplicateEmail) {
        const mappedErrors = {
          ...(validation.errors || {}),
          ...(duplicateDoc ? { document: true } : {}),
          ...(duplicateEmail ? { email: true } : {})
        };
        applyModalFieldValidationStates(createFieldMap, mappedErrors);

        const firstErr = Object.values(validation.errors || {})[0];
        const errorMessage = duplicateDoc
          ? 'Ya existe un usuario registrado con ese número de documento.'
          : duplicateEmail
            ? 'Ya existe un usuario registrado con ese correo institucional.'
            : firstErr ||
              'Revisa que la información que escribiste cumple con las validaciones.';

        setAlertMessage({
          modalId: 'modal-user-error',
          messageSelector: '#modal-user-error-message',
          message: errorMessage,
          open: true
        });
        return;
      }

      applyModalFieldValidationStates(createFieldMap, {});
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
      const typedPassword = String(formValues.password ?? '');
      const resolvedPassword =
        typedPassword.trim().length > 0
          ? typedPassword
          : String(selectedUser.password ?? '');


      const candidate = normalizeUserRecord(
        {
          ...formValues,
          role: formatRoleInput(formValues.role, selectedUser.role),
          phone: String(formValues.phone ?? selectedUser.phone ?? '').trim(),
          password: resolvedPassword
        },
        selectedUser
      );

      if (typedPassword.trim().length === 0 && selectedUser.password) {
        candidate.password = selectedUser.password;
      }

      const validation = validateUserSchema(candidate);

      const duplicateDoc = allUsers.some(
        (u) =>
          u.id !== selectedUser.id &&
          String(u.document ?? '').trim() === candidate.document
      );
      const duplicateEmail = allUsers.some(
        (u) =>
          u.id !== selectedUser.id &&
          String(u.email ?? '').trim().toLowerCase() === candidate.email
      );

      if (!validation.valid || duplicateDoc || duplicateEmail) {
        const mappedErrors = {
          ...(validation.errors || {}),
          ...(duplicateDoc ? { document: true } : {}),
          ...(duplicateEmail ? { email: true } : {})
        };
        applyModalFieldValidationStates(detailFieldMap, mappedErrors);

        const firstErr = Object.values(validation.errors || {})[0];
        const errorMessage = duplicateDoc
          ? 'Ya existe un usuario registrado con ese número de documento.'
          : duplicateEmail
            ? 'Ya existe un usuario registrado con ese correo institucional.'
            : firstErr ||
              'Revisa que la información que escribiste cumple con las validaciones.';

        setAlertMessage({
          modalId: 'modal-user-error',
          messageSelector: '#modal-user-error-message',
          message: errorMessage,
          open: true
        });
        return;
      }

      applyModalFieldValidationStates(detailFieldMap, {});
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

      const exists = allUsers.some((u) => u.id === pendingEditCandidate.id);
      allUsers = exists
        ? allUsers.map((u) => (u.id === pendingEditCandidate.id ? pendingEditCandidate : u))
        : [...allUsers, pendingEditCandidate];

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

export function initUserProfile({ onRequireAuth = null } = {}) {
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

  const sessionId = String(session.userId ?? session.id ?? '').trim();
  const sessionDoc = String(session.document ?? '').trim();
  const sessionEmail = String(session.email ?? '').trim().toLowerCase();

  const matchedUser = allUsers.find((u) => {
    const uId = String(u?.id ?? '').trim();
    const uDoc = String(u?.document ?? '').trim();
    const uEmail = String(u?.email ?? '').trim().toLowerCase();
    return (
      (sessionId && uId && uId === sessionId) ||
      (sessionEmail && uEmail && uEmail === sessionEmail) ||
      (sessionDoc && uDoc && uDoc === sessionDoc)
    );
  });

  let currentUser = matchedUser ? { ...matchedUser } : { ...session };
  const originalPassword = String(matchedUser?.password ?? currentUser?.password ?? '');

  let isEditMode = false;
  let typingTimeout = null;

  const editBtn = document.getElementById('btn-enable-profile-edit');
  const saveBtn = document.getElementById('btn-save-profile');
  const instructionEl = document.getElementById('profile-instruction');
  const validationsBox = document.getElementById('profile-validations-box');
  const validationsText = document.getElementById('profile-validations-text');
  const errorBox = document.getElementById('profile-error-box');
  const errorMsgEl = document.getElementById('profile-error-message');
  const errorBackBtn = document.getElementById('btn-profile-error-back');

  const fieldConfigs = {
    name: {
      btn: document.getElementById('btn-select-name'),
      input: document.getElementById('input-profile-name')
    },
    document: {
      btn: document.getElementById('btn-select-document'),
      input: document.getElementById('input-profile-document')
    },
    email: {
      btn: document.getElementById('btn-select-email'),
      input: document.getElementById('input-profile-email')
    },
    role: {
      btn: document.getElementById('btn-select-role'),
      input: document.getElementById('input-profile-role')
    },
    password: {
      btn: document.getElementById('btn-select-password'),
      input: document.getElementById('input-profile-password')
    }
  };

  const initialPasswordInputValue = fieldConfigs.password.input?.value ?? '';

  function fillInputsFromUser(user) {
    if (fieldConfigs.name.input) fieldConfigs.name.input.value = user?.name ?? '';
    if (fieldConfigs.document.input) fieldConfigs.document.input.value = user?.document ?? '';
    if (fieldConfigs.email.input) fieldConfigs.email.input.value = user?.email ?? '';
    if (fieldConfigs.role.input) fieldConfigs.role.input.value = user?.role ?? '';
    if (fieldConfigs.password.input) {
      fieldConfigs.password.input.value = user?.password || originalPassword || '';
    }
  }

  function setFieldEditable(fieldName, editable) {
    const cfg = fieldConfigs[fieldName];
    if (!cfg?.input) return;
    cfg.input.readOnly = !editable;
    cfg.input.toggleAttribute('readonly', !editable);
    if (cfg.btn) {
      cfg.btn.setAttribute('aria-pressed', String(Boolean(editable)));
      cfg.btn.classList.toggle('is-selected', Boolean(editable));
    }
  }

  function enterEditMode() {
    isEditMode = true;
    document.body.dataset.editMode = 'true';
    editBtn?.classList.add('is-hidden');
    saveBtn?.classList.remove('is-hidden');
    errorBox?.classList.add('is-hidden');

    if (instructionEl) {
      instructionEl.textContent =
        'Haz clic en el campo que deseas modificar y luego presiona "Guardar información".';
    }

    Object.keys(fieldConfigs).forEach((key) => {
      setFieldEditable(key, true);
    });
    fieldConfigs.name.input?.focus();
  }

  Object.entries(fieldConfigs).forEach(([fieldName, { btn, input }]) => {
    if (btn && input) {
      btn.addEventListener('click', () => {
        if (!isEditMode) enterEditMode();
        setFieldEditable(fieldName, true);
        input.focus();
        if (input.dataset.ruleText && validationsText && validationsBox) {
          validationsText.textContent = input.dataset.ruleText;
          validationsBox.classList.remove('is-hidden');
        }
      });
    }

    if (input) {
      input.addEventListener('input', () => {
        if (!isEditMode || !validationsBox || !validationsText) return;
        const rule = input.dataset.ruleText || 'Verifica el formato del campo.';
        validationsText.textContent = rule;
        validationsBox.classList.remove('is-hidden');

        window.clearTimeout(typingTimeout);
        typingTimeout = window.setTimeout(() => {
          validationsBox.classList.add('is-hidden');
        }, 2500);
      });
    }
  });

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      enterEditMode();
    });
  }

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const rawRole = String(fieldConfigs.role.input?.value ?? '').trim();
      const formattedRole = rawRole
        ? rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase()
        : '';

      const rawPwdInput = String(fieldConfigs.password.input?.value ?? '');
      const didChangePassword =
        rawPwdInput.trim().length > 0 &&
        rawPwdInput !== 'Contraseña usuario' &&
        rawPwdInput !== initialPasswordInputValue &&
        rawPwdInput !== originalPassword;

      const resolvedPassword = didChangePassword
        ? rawPwdInput
        : originalPassword || String(currentUser?.password ?? '');

      const candidate = normalizeUserRecord(
        {
          name: fieldConfigs.name.input?.value ?? '',
          document: fieldConfigs.document.input?.value ?? '',
          email: fieldConfigs.email.input?.value ?? '',
          phone: currentUser?.phone ?? session?.phone ?? '3000000000',
          role: formattedRole,
          password: resolvedPassword
        },
        currentUser
      );

      if (!didChangePassword && resolvedPassword) {
        candidate.password = resolvedPassword;
      }

      const validation = validateUserSchema(candidate);
      const duplicateDoc = allUsers.some(
        (u) => u.id !== currentUser.id && String(u.document).trim() === candidate.document
      );
      const duplicateEmail = allUsers.some(
        (u) =>
          u.id !== currentUser.id &&
          String(u.email).trim().toLowerCase() === candidate.email
      );

      if (!validation.valid || duplicateDoc || duplicateEmail) {
        if (errorMsgEl) {
          errorMsgEl.textContent = duplicateDoc
            ? 'Ya existe otro usuario con ese número de documento.'
            : duplicateEmail
              ? 'Ya existe otro usuario con ese correo institucional.'
              : Object.values(validation.errors || {})[0] ||
                'Revisa que la información que escribiste cumple con las validaciones.';
        }
        errorBox?.classList.remove('is-hidden');
        return;
      }

      const existsInList = allUsers.some((u) => u.id === currentUser.id);
      allUsers = existsInList
        ? allUsers.map((u) => (u.id === currentUser.id ? candidate : u))
        : [...allUsers, candidate];

      currentUser = { ...candidate };
      saveUsersToStorage(allUsers);

      try {
        const { password: _omitPassword, ...safeSessionFields } = candidate;
        localStorage.setItem(
          'acme_school_session_v1',
          JSON.stringify({ ...session, ...safeSessionFields })
        );
      } catch (_) {}

      fillInputsFromUser(currentUser);
      isEditMode = false;
      document.body.dataset.editMode = 'false';
      Object.keys(fieldConfigs).forEach((key) => setFieldEditable(key, false));
      validationsBox?.classList.add('is-hidden');
      errorBox?.classList.add('is-hidden');
      saveBtn.classList.add('is-hidden');
      editBtn?.classList.remove('is-hidden');

      if (instructionEl) {
        instructionEl.textContent =
          'Aquí puedes consultar los datos registrados de tu cuenta en Acme School.';
      }

      showToast('Información de perfil actualizada', { type: 'success' });
    });
  }

  if (errorBackBtn) {
    errorBackBtn.addEventListener('click', () => {
      errorBox?.classList.add('is-hidden');
    });
  }

  fillInputsFromUser(currentUser);
  Object.keys(fieldConfigs).forEach((key) => setFieldEditable(key, false));

  return { user: currentUser };
}
