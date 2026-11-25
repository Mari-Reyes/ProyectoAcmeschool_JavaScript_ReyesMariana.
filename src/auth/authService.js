const USERS_STORAGE_KEY = 'acme_school_users_v1';
const SESSION_STORAGE_KEY = 'acme_school_session_v1';

/**
 * Lee de forma segura un arreglo desde localStorage.
 */
function readUsersFromStorage() {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error al leer usuarios desde localStorage:', error);
    return [];
  }
}

/**
 * Guarda o limpia la sesión activa en localStorage.
 */
function writeSessionToStorage(sessionData) {
  try {
    if (!sessionData) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error al guardar sesión en localStorage:', error);
  }
}

/**
 * Obtiene la sesión activa actual o null si no hay sesión iniciada.
 */
export function getActiveSession() {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || !parsed.email) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error('Error al leer la sesión activa:', error);
    return null;
  }
}

/**
 * Indica si existe una sesión privada activa.
 */
export function isAuthenticated() {
  return Boolean(getActiveSession());
}

/**
 * Valida las credenciales de ingreso según las especificaciones de Acme School:
 * - Correo debe coincidir exactamente con un usuario registrado.
 * - Contraseña debe coincidir exactamente con la registrada para ese usuario.
 * - Si solo uno falla, se limpia únicamente ese campo; si ambos fallan, se limpian ambos.
 */
export function authenticateUser(emailInput, passwordInput) {
  const normalizedEmail = String(emailInput ?? '').trim();
  const rawPassword = String(passwordInput ?? '');
  const users = readUsersFromStorage();

  const matchedByEmail = users.find(
    (user) => String(user.email ?? '').trim().toLowerCase() === normalizedEmail.toLowerCase()
  );

  const isEmailValid = Boolean(normalizedEmail && matchedByEmail);
  const isPasswordValid = Boolean(
    rawPassword && matchedByEmail && String(matchedByEmail.password ?? '') === rawPassword
  );

  // Caso 1: ambos válidos -> ingreso autorizado
  if (isEmailValid && isPasswordValid) {
    const session = {
      userId: matchedByEmail.id,
      name: matchedByEmail.name,
      document: matchedByEmail.document,
      email: matchedByEmail.email,
      phone: matchedByEmail.phone ?? '',
      role: matchedByEmail.role,
      loggedAt: new Date().toISOString()
    };
    writeSessionToStorage(session);

    return {
      ok: true,
      status: 'authorized',
      user: session,
      clearEmail: false,
      clearPassword: false,
      message: `Bienvenido, ${matchedByEmail.name}.`
    };
  }

  // Caso 2: ambos inválidos
  if (!isEmailValid && !isPasswordValid) {
    return {
      ok: false,
      status: 'invalid-both',
      user: null,
      clearEmail: true,
      clearPassword: true,
      emailError: 'CORREO INVÁLIDO | VUELVE A INTENTARLO',
      passwordError: 'CONTRASEÑA INVÁLIDA | VUELVE A INTENTARLO'
    };
  }

  // Caso 3: correo inválido (se limpia solo correo; se conserva contraseña escrita)
  if (!isEmailValid) {
    return {
      ok: false,
      status: 'invalid-email',
      user: null,
      clearEmail: true,
      clearPassword: false,
      emailError: 'CORREO INVÁLIDO | VUELVE A INTENTARLO',
      passwordError: ''
    };
  }

  // Caso 4: contraseña inválida (se conserva correo válido; se limpia solo contraseña)
  return {
    ok: false,
    status: 'invalid-password',
    user: null,
    clearEmail: false,
    clearPassword: true,
    emailError: '',
    passwordError: 'CONTRASEÑA INVÁLIDA | VUELVE A INTENTARLO'
  };
}

/**
 * Cambia el tipo de input de contraseña entre 'password' (oculto con puntos) y 'text' (visible).
 */
export function setPasswordVisibility(passwordInputElement, mode = 'hide') {
  if (!passwordInputElement) return 'password';
  const nextType = mode === 'show' ? 'text' : 'password';
  passwordInputElement.type = nextType;
  return nextType;
}

/**
 * Cierra la sesión activa y limpia los datos de sesión en localStorage.
 */
export function logoutUser() {
  writeSessionToStorage(null);
  return { ok: true };
}

export const AUTH_STORAGE_KEYS = Object.freeze({
  users: USERS_STORAGE_KEY,
  session: SESSION_STORAGE_KEY
});

export function clearActiveSession() {
  return logoutUser();
}
