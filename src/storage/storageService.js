/**
 * Servicio de almacenamiento: src/storage/storageService.js
 * Centraliza el acceso a localStorage, las claves de datos de Acme School
 * y la inicialización segura con los datos semilla (seed.js).
 */

import { buildSeedData } from '../data/seed.js';

export const STORAGE_KEYS = Object.freeze({
  USERS: 'acme_school_users_v1',
  SESSION: 'acme_school_session_v1',
  EXAMS: 'acme_school_exams_v1',
  ATTEMPTS: 'acme_school_exam_attempts_v1',
  COMPLETED_EXAMS: 'acme_school_completed_exams_v1',
  SEED_INITIALIZED: 'acme_school_seed_initialized_v1'
});

/**
 * Lee y parsea un valor JSON desde localStorage de forma segura.
 */
export function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[storageService] Error al leer la clave "${key}":`, error);
    return fallback;
  }
}

/**
 * Serializa y guarda un valor en localStorage de forma segura.
 */
export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[storageService] Error al escribir la clave "${key}":`, error);
    return false;
  }
}

/**
 * Elimina una clave de localStorage.
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`[storageService] Error al eliminar la clave "${key}":`, error);
    return false;
  }
}

/**
 * Inicializa usuarios y exámenes en localStorage usando buildSeedData()
 * únicamente si aún no han sido inicializados o si están vacíos por primera vez.
 * No sobrescribe cambios guardados posteriormente por el usuario.
 */
export function ensureInitialSeedData({ forceReset = false } = {}) {
  const seed = buildSeedData();
  const alreadyInitialized = localStorage.getItem(STORAGE_KEYS.SEED_INITIALIZED) === 'true';

  if (forceReset) {
    writeStorage(STORAGE_KEYS.USERS, seed.users);
    writeStorage(STORAGE_KEYS.EXAMS, seed.exams);
    localStorage.setItem(STORAGE_KEYS.SEED_INITIALIZED, 'true');
    return {
      seededUsers: true,
      seededExams: true,
      users: seed.users,
      exams: seed.exams
    };
  }

  let seededUsers = false;
  let seededExams = false;

  const existingUsers = readStorage(STORAGE_KEYS.USERS, null);
  if (!alreadyInitialized || !Array.isArray(existingUsers)) {
    writeStorage(STORAGE_KEYS.USERS, seed.users);
    seededUsers = true;
  }

  const existingExams = readStorage(STORAGE_KEYS.EXAMS, null);
  if (!alreadyInitialized || !Array.isArray(existingExams)) {
    writeStorage(STORAGE_KEYS.EXAMS, seed.exams);
    seededExams = true;
  }

  if (!alreadyInitialized) {
    localStorage.setItem(STORAGE_KEYS.SEED_INITIALIZED, 'true');
  }

  return {
    seededUsers,
    seededExams,
    users: readStorage(STORAGE_KEYS.USERS, []),
    exams: readStorage(STORAGE_KEYS.EXAMS, [])
  };
}

/**
 * Restablece explícitamente usuarios y exámenes a los datos semilla originales.
 */
export function resetSeedData() {
  return ensureInitialSeedData({ forceReset: true });
}

/**
 * Helpers específicos para colecciones principales.
 */
export function getUsersCollection() {
  const data = readStorage(STORAGE_KEYS.USERS, []);
  return Array.isArray(data) ? data : [];
}

export function saveUsersCollection(users = []) {
  return writeStorage(STORAGE_KEYS.USERS, Array.isArray(users) ? users : []);
}

export function getExamsCollection() {
  const data = readStorage(STORAGE_KEYS.EXAMS, []);
  return Array.isArray(data) ? data : [];
}

export function saveExamsCollection(exams = []) {
  return writeStorage(STORAGE_KEYS.EXAMS, Array.isArray(exams) ? exams : []);
}

export function getAttemptsCollection() {
  const data = readStorage(STORAGE_KEYS.ATTEMPTS, []);
  return Array.isArray(data) ? data : [];
}

export function saveAttemptsCollection(attempts = []) {
  return writeStorage(STORAGE_KEYS.ATTEMPTS, Array.isArray(attempts) ? attempts : []);
}
