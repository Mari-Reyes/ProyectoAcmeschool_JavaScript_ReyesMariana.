/**
 * Componente: src/componets/toast-alert.js
 * Gestiona notificaciones tipo toast (ej. "Marcado como hecho"),
 * alertas de estado y apertura/cierre de ventanas emergentes modales.
 */

const TOAST_CONTAINER_ID = 'acme-toast-container';

function ensureToastContainer() {
  let container = document.getElementById(TOAST_CONTAINER_ID);
  if (container) return container;

  container = document.createElement('div');
  container.id = TOAST_CONTAINER_ID;
  container.className = 'toast-container';
  container.setAttribute('aria-live', 'polite');
  container.setAttribute('aria-atomic', 'false');
  document.body.appendChild(container);
  return container;
}

/**
 * Muestra una notificación flotante (toast) con animación suave.
 * @param {string} message - Texto a mostrar (ej. "Marcado como hecho").
 * @param {Object} options - { type: 'info' | 'success' | 'warning' | 'error', duration: number }
 */
export function showToast(message, options = {}) {
  const { type = 'info', duration = 3000 } = options;
  const text = String(message ?? '').trim();
  if (!text) return null;

  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast-alert toast-alert--${type} is-entering`;
  toast.setAttribute('role', 'status');

  const textEl = document.createElement('span');
  textEl.className = 'toast-alert__message';
  textEl.textContent = text;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toast-alert__close';
  closeBtn.setAttribute('aria-label', 'Cerrar notificación');
  closeBtn.textContent = '×';

  const dismiss = () => {
    toast.classList.remove('is-entering');
    toast.classList.add('is-leaving');
    window.setTimeout(() => {
      toast.remove();
    }, 260);
  };

  closeBtn.addEventListener('click', dismiss);
  toast.append(textEl, closeBtn);
  container.appendChild(toast);

  window.requestAnimationFrame(() => {
    toast.classList.remove('is-entering');
    toast.classList.add('is-visible');
  });

  if (duration > 0) {
    window.setTimeout(dismiss, duration);
  }

  return toast;
}

/**
 * Abre una ventana emergente modal quitándole la clase 'is-hidden'.
 * @param {string|HTMLElement} modalOrId
 */
export function openModal(modalOrId) {
  const modal =
    typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
  if (!modal) return null;

  modal.classList.remove('is-hidden');
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  return modal;
}

/**
 * Cierra una ventana emergente modal agregándole la clase 'is-hidden'.
 * @param {string|HTMLElement} modalOrId
 */
export function closeModal(modalOrId) {
  const modal =
    typeof modalOrId === 'string' ? document.getElementById(modalOrId) : modalOrId;
  if (!modal) return null;

  modal.classList.remove('is-open');
  modal.classList.add('is-hidden');
  modal.setAttribute('aria-hidden', 'true');
  return modal;
}

/**
 * Actualiza el texto de un mensaje dentro de una alerta o modal y opcionalmente lo abre.
 * @param {Object} params - { modalId, messageSelector, message, open }
 */
export function setAlertMessage({
  modalId = null,
  messageSelector = null,
  message = '',
  open = false
} = {}) {
  if (messageSelector) {
    const msgEl = document.querySelector(messageSelector);
    if (msgEl && message) {
      msgEl.textContent = message;
    }
  }
  if (modalId && open) {
    openModal(modalId);
  }
}

/**
 * Registra delegaciones globales para botones con [data-open-modal],
 * [data-close-modal] y [data-close-auth].
 */
export function initModalDismissListeners() {
  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-open-modal]');
    if (openTrigger) {
      const targetId = openTrigger.dataset.openModal;
      if (targetId) openModal(targetId);
      return;
    }

    const closeTrigger = event.target.closest('[data-close-modal], [data-close-auth]');
    if (closeTrigger) {
      const targetId =
        closeTrigger.dataset.closeModal || closeTrigger.dataset.closeAuth;
      if (targetId) closeModal(targetId);
    }
  });
}

export function bindModalCloseTriggers() {
  initModalDismissListeners();
}
