/**
 * Punto de entrada: src/app.js
 * Inicializa los datos semilla, la navegación compartida, el modal de login/cierre de sesión
 * y el controlador correspondiente a la vista activa de Acme School.
 */

import { ensureInitialSeedData } from './storage/storageService.js';
import {
  authenticateUser,
  clearActiveSession,
  getActiveSession,
  isAuthenticated
} from './auth/authService.js';
import {
  renderAuthenticatedUserGreeting,
  bindLogoutAction
} from './componets/exam-header.js';
import {
  bindModalCloseTriggers,
  closeModal,
  openModal,
  setAlertMessage,
  showToast
} from './componets/toast-alert.js';
import { initExamsControllers } from './modules/exams/examsControllers.js';
import {
  initStudentExamsCatalog,
  initStudentExamRegistration,
  initExamRunnerSession,
  initStudentResultScreen
} from './modules/examTaking/examRunnerController.js';
import { initUsersController } from './modules/users/usersController.js';

const PRIVATE_PAGES = new Set([
  'portal-home',
  'users-management',
  'exams-management',
  'user-profile'
]);

function detectCurrentPageKey() {
  const bodyPage = document.body?.dataset?.page;
  if (bodyPage) return String(bodyPage).trim();

  if (document.getElementById('users-board') || document.getElementById('users-list')) {
    return 'users-management';
  }
  if (
    document.getElementById('exams-management-list') ||
    document.getElementById('section-exams-list')
  ) {
    return 'exams-management';
  }
  if (
    document.getElementById('exam-runner-main') ||
    document.getElementById('question-options-container')
  ) {
    return 'exam-runner';
  }
  if (
    document.getElementById('result-main') ||
    document.getElementById('result-exam-title')
  ) {
    return 'exam-result';
  }
  if (
    document.getElementById('student-registration-form') ||
    document.getElementById('student-name-input')
  ) {
    return 'student-registration';
  }
  if (document.getElementById('student-exams-list')) {
    return 'student-exams';
  }

  return 'home';
}

function bindGlobalLoginAndSession() {
  const session = getActiveSession();
  renderAuthenticatedUserGreeting(session);
  bindModalCloseTriggers();

  const openLoginBtn = document.getElementById('btn-open-login');
  if (openLoginBtn) {
    openLoginBtn.addEventListener('click', () => {
      openModal('modal-login');
    });
  }

  const loginForm =
  document.getElementById('login-form') || document.querySelector('[data-login-form]');
if (loginForm) {
  const emailInput =
    document.getElementById('login-email') ||
    loginForm.querySelector('input[type="email"], [name="email"]');
  const passwordInput =
    document.getElementById('login-password') ||
    loginForm.querySelector('input[type="password"], [name="password"]');

  const emailGroup =
    document.getElementById('login-email-group') || emailInput?.closest('.auth-field') || null;
  const passwordGroup =
    document.getElementById('login-password-group') ||
    passwordInput?.closest('.auth-field') ||
    null;

  const resetFieldState = (input, group) => {
    if (!input) return;
    input.classList.remove('is-invalid');
    if (input.dataset.defaultPlaceholder) {
      input.placeholder = input.dataset.defaultPlaceholder;
    }
    group?.setAttribute('data-field-status', 'valid');
  };

  const setFieldInvalid = (input, group, errorMessage) => {
    if (!input) return;
    input.value = '';
    input.classList.add('is-invalid');
    input.placeholder =
      errorMessage || input.dataset.errorPlaceholder || input.placeholder;
    group?.setAttribute('data-field-status', 'invalid');
  };

  // Si el usuario vuelve a escribir en un campo, regresamos su estado a válido
  emailInput?.addEventListener('input', () => resetFieldState(emailInput, emailGroup));
  passwordInput?.addEventListener('input', () => resetFieldState(passwordInput, passwordGroup));

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailVal = emailInput?.value ?? '';
    const passwordVal = passwordInput?.value ?? '';
    const result = authenticateUser(emailVal, passwordVal);

    if (result.ok || result.status === 'authorized') {
      resetFieldState(emailInput, emailGroup);
      resetFieldState(passwordInput, passwordGroup);

      loginForm.setAttribute('data-auth-state', 'authorized');

      const authorizedBanner = document.getElementById('auth-authorized-banner');
      const welcomeMessageEl = document.getElementById('auth-welcome-message');
      const loggedUserNameEl = authorizedBanner?.querySelector('[data-logged-user-name]');
      const userName =
        result.user?.name ||
        result.user?.fullName ||
        result.user?.nombre ||
        'usuario';

      if (loggedUserNameEl) {
        loggedUserNameEl.textContent = userName;
      } else if (welcomeMessageEl) {
        welcomeMessageEl.textContent = `Bienvenido, ${userName}.`;
      }

      authorizedBanner?.classList.remove('is-hidden');
      showToast(result.message || `Bienvenido/a, ${userName}`, { type: 'success' });

      setTimeout(() => {
        closeModal('modal-login');
        window.location.href = 'portal-academico.html';
      }, 3000);
      return;
    }



    if (result.clearEmail) {
      setFieldInvalid(emailInput, emailGroup, result.emailError);
    } else {
      resetFieldState(emailInput, emailGroup);
    }

    if (result.clearPassword) {
      setFieldInvalid(passwordInput, passwordGroup, result.passwordError);
    } else {
      resetFieldState(passwordInput, passwordGroup);
    }

    const errorText =
      result.message ||
      [result.emailError, result.passwordError].filter(Boolean).join(' · ') ||
      'Correo o contraseña incorrectos.';

    setAlertMessage({
      modalId: 'modal-login-error',
      messageSelector: '#modal-login-error-message',
      message: errorText,
      open: true
    });
  });
}


  bindLogoutAction({
    onLogout: () => {
      clearActiveSession();
      showToast('Sesión cerrada correctamente', { type: 'info' });
      window.location.href = 'index.html';
    }
  });
}

function bootstrapApp() {
  ensureInitialSeedData();
  bindGlobalLoginAndSession();

  const pageKey = detectCurrentPageKey();

  if (PRIVATE_PAGES.has(pageKey) && !isAuthenticated()) {
    window.location.href = 'index.html';
    return;
  }

  switch (pageKey) {
    case 'users-management':
      initUsersController({
        onRequireAuth: () => {
          window.location.href = 'index.html';
        }
      });
      break;

    case 'exams-management':
      initExamsControllers({
        onNavigate: () => {}
      });
      break;

    case 'student-exams':
      initStudentExamsCatalog({
        onStartExam: () => {
          window.location.href = 'registro-estudiante.html';
        },
        onViewResult: () => {
          window.location.href = 'resultado-estudiante.html';
        }
      });
      break;

    case 'student-registration':
      initStudentExamRegistration({
        onProceed: () => {
          window.location.href = 'visualizacion-examen.html';
        }
      });
      break;

    case 'exam-runner':
      initExamRunnerSession({
        onFinishExam: () => {
          window.location.href = 'resultado-estudiante.html';
        }
      });
      break;

    case 'exam-result':
      initStudentResultScreen({
        onBackToCatalog: () => {
          window.location.href = 'vista-estudiante.html';
        }
      });
      break;

    default:
      break;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
