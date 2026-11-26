/**
 * Datos semilla: src/data/seed.js
 * Contiene la cuenta principal de Administrador, 6 usuarios adicionales (Docentes y Administradores)
 * y 10 exámenes completos para inicializar la plataforma Acme School.
 */

export const SEED_USERS = Object.freeze([
  // Cuenta principal de Administrador para navegar por todo el portal
  {
    id: 'usr-admin-001',
    name: 'Laura Sofia Mendoza Rios',
    document: '1098765432',
    email: 'laura.mendoza@acmeschool.edu',
    phone: '3004128890',
    role: 'Administrador',
    password: 'AdminAcme.2026',
    isPrimaryAdmin: true
  },
  // 6 usuarios adicionales entre Docentes y Administradores
  {
    id: 'usr-doc-002',
    name: 'Carlos Andres Rojas Gomez',
    document: '1094552180',
    email: 'carlos.rojas@acmeschool.edu',
    phone: '3115209941',
    role: 'Docente',
    password: 'DocenteRojas.1',
    isPrimaryAdmin: false
  },
  {
    id: 'usr-adm-003',
    name: 'Maria Fernanda Torres Perez',
    document: '1092338714',
    email: 'maria.torres@acmeschool.edu',
    phone: '3158842105',
    role: 'Administrador',
    password: 'AdminTorres.2',
    isPrimaryAdmin: false
  },
  {
    id: 'usr-doc-004',
    name: 'Diego Alejandro Castro Ruiz',
    document: '1096114902',
    email: 'diego.castro@acmeschool.edu',
    phone: '3187401123',
    role: 'Docente',
    password: 'DocenteCastro.3',
    isPrimaryAdmin: false
  },
  {
    id: 'usr-doc-005',
    name: 'Valentina Isabel Morales Diaz',
    document: '1098003419',
    email: 'valentina.morales@acmeschool.edu',
    phone: '3206194478',
    role: 'Docente',
    password: 'DocenteMorales.4',
    isPrimaryAdmin: false
  },
  {
    id: 'usr-adm-006',
    name: 'Julian David Herrera Silva',
    document: '1095447821',
    email: 'julian.herrera@acmeschool.edu',
    phone: '3019925530',
    role: 'Administrador',
    password: 'AdminHerrera.5',
    isPrimaryAdmin: false
  },
  {
    id: 'usr-doc-007',
    name: 'Camila Andrea Vargas Ortiz',
    document: '1093776512',
    email: 'camila.vargas@acmeschool.edu',
    phone: '3124508819',
    role: 'Docente',
    password: 'DocenteVargas.6',
    isPrimaryAdmin: false
  }
]);

export const SEED_EXAMS = Object.freeze([
  {
    id: 'exam-001',
    code: 'MAT-101',
    title: 'Álgebra y Funciones Lineales',
    description: 'Evaluación sobre ecuaciones lineales, pendiente de una recta, sistemas de dos incógnitas y funciones afines.',
    durationMinutes: 1,
    durationSeconds: 1800,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-001-1',
        number: 1,
        title: 'Pregunta 1',
        statement: 'Si una función lineal tiene la forma f(x) = 3x - 6, ¿cuál es el valor de x cuando f(x) = 0?',
        options: [
          { id: 'opt-0', text: 'x = 2', isCorrect: true },
          { id: 'opt-1', text: 'x = -2', isCorrect: false },
          { id: 'opt-2', text: 'x = 6', isCorrect: false },
          { id: 'opt-3', text: 'x = 0', isCorrect: false }
        ]
      },
      {
        id: 'q-001-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Cuál es la pendiente de la recta que pasa por los puntos (1, 2) y (3, 6)?',
        options: [
          { id: 'opt-0', text: 'm = 1', isCorrect: false },
          { id: 'opt-1', text: 'm = 2', isCorrect: true },
          { id: 'opt-2', text: 'm = 4', isCorrect: false },
          { id: 'opt-3', text: 'm = -2', isCorrect: false }
        ]
      },
      {
        id: 'q-001-3',
        number: 3,
        title: 'Pregunta 3',
        statement: 'Al resolver 2x + 5 = 17, ¿qué valor toma x?',
        options: [
          { id: 'opt-0', text: 'x = 11', isCorrect: false },
          { id: 'opt-1', text: 'x = 5', isCorrect: false },
          { id: 'opt-2', text: 'x = 6', isCorrect: true },
          { id: 'opt-3', text: 'x = 12', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-002',
    code: 'LEN-102',
    title: 'Comprensión Lectora y Gramática',
    description: 'Prueba diagnóstica sobre idea principal, inferencia textual, categorías gramaticales y ortografía.',
    durationMinutes: 25,
    durationSeconds: 1500,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-002-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Qué función cumple principalmente la idea principal dentro de un párrafo expositivo?',
        options: [
          { id: 'opt-0', text: 'Resume el núcleo central que desarrollan las ideas secundarias', isCorrect: true },
          { id: 'opt-1', text: 'Introduce anécdotas personales sin relación con el tema', isCorrect: false },
          { id: 'opt-2', text: 'Reemplaza la conclusión final del texto', isCorrect: false },
          { id: 'opt-3', text: 'Enumera ejemplos irrelevantes para alargar el texto', isCorrect: false }
        ]
      },
      {
        id: 'q-002-2',
        number: 2,
        title: 'Pregunta 2',
        statement: 'En la oración "Los estudiantes entregaron el proyecto puntualmente", ¿cuál es el núcleo del predicado?',
        options: [
          { id: 'opt-0', text: 'Los estudiantes', isCorrect: false },
          { id: 'opt-1', text: 'entregaron', isCorrect: true },
          { id: 'opt-2', text: 'el proyecto', isCorrect: false },
          { id: 'opt-3', text: 'puntualmente', isCorrect: false }
        ]
      },
      {
        id: 'q-002-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿Cuál de las siguientes palabras es grave y lleva tilde por terminar en consonante distinta de n o s?',
        options: [
          { id: 'opt-0', text: 'camión', isCorrect: false },
          { id: 'opt-1', text: 'árbol', isCorrect: true },
          { id: 'opt-2', text: 'música', isCorrect: false },
          { id: 'opt-3', text: 'pared', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-003',
    code: 'CIE-103',
    title: 'Biología Celular y Genética Básica',
    description: 'Evaluación sobre organelos celulares, transporte de membrana, mitosis y principios de herencia.',
    durationMinutes: 30,
    durationSeconds: 1800,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-003-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Cuál es el organelo celular encargado principalmente de la producción de ATP mediante respiración celular?',
        options: [
          { id: 'opt-0', text: 'Aparato de Golgi', isCorrect: false },
          { id: 'opt-1', text: 'Mitocondria', isCorrect: true },
          { id: 'opt-2', text: 'Lisosoma', isCorrect: false },
          { id: 'opt-3', text: 'Retículo endoplasmático liso', isCorrect: false }
        ]
      },
      {
        id: 'q-003-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Qué estructura rodea la célula y regula el intercambio selectivo de sustancias con el exterior?',
        options: [
          { id: 'opt-0', text: 'Membrana plasmática', isCorrect: true },
          { id: 'opt-1', text: 'Nucléolo', isCorrect: false },
          { id: 'opt-2', text: 'Centriolo', isCorrect: false },
          { id: 'opt-3', text: 'Vacuola central', isCorrect: false }
        ]
      },
      {
        id: 'q-003-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿En qué molécula se almacena la información genética hereditaria en la mayoría de los organismos?',
        options: [
          { id: 'opt-0', text: 'ADN', isCorrect: true },
          { id: 'opt-1', text: 'Celulosa', isCorrect: false },
          { id: 'opt-2', text: 'Queratina', isCorrect: false },
          { id: 'opt-3', text: 'Glucógeno', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-004',
    code: 'HIS-104',
    title: 'Historia Universal y Procesos Contemporáneos',
    description: 'Repaso de revoluciones políticas, industrialización, guerras mundiales y organización internacional.',
    durationMinutes: 20,
    durationSeconds: 1200,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-004-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Qué documento emblemático de 1789 proclamó los derechos naturales del hombre y del ciudadano en Francia?',
        options: [
          { id: 'opt-0', text: 'La Declaración de los Derechos del Hombre y del Ciudadano', isCorrect: true },
          { id: 'opt-1', text: 'El Tratado de Versalles', isCorrect: false },
          { id: 'opt-2', text: 'La Carta de las Naciones Unidas', isCorrect: false },
          { id: 'opt-3', text: 'El Edicto de Nantes', isCorrect: false }
        ]
      },
      {
        id: 'q-004-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Cuál fue uno de los principales cambios impulsados por la Primera Revolución Industrial?',
        options: [
          { id: 'opt-0', text: 'La mecanización de la producción y el uso de la máquina de vapor', isCorrect: true },
          { id: 'opt-1', text: 'El fin del comercio marítimo transoceánico', isCorrect: false },
          { id: 'opt-2', text: 'La eliminación de las ciudades fabriles', isCorrect: false },
          { id: 'opt-3', text: 'El regreso exclusivo a la economía feudal', isCorrect: false }
        ]
      },
      {
        id: 'q-004-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿En qué década finalizó la Segunda Guerra Mundial?',
        options: [
          { id: 'opt-0', text: 'En la década de 1920', isCorrect: false },
          { id: 'opt-1', text: 'En la década de 1940', isCorrect: true },
          { id: 'opt-2', text: 'En la década de 1960', isCorrect: false },
          { id: 'opt-3', text: 'En la década de 1980', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-005',
    code: 'FIS-105',
    title: 'Cinemática y Leyes de Newton',
    description: 'Evaluación sobre movimiento rectilíneo, aceleración, fuerza neta, inercia y acción-reacción.',
    durationMinutes: 30,
    durationSeconds: 1800,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-005-1',
        number: 1,
        title: 'Pregunta 1',
        statement: 'Según la Primera Ley de Newton, un cuerpo mantiene su estado de reposo o movimiento rectilíneo uniforme si:',
        options: [
          { id: 'opt-0', text: 'La fuerza neta que actúa sobre él es cero', isCorrect: true },
          { id: 'opt-1', text: 'Su masa aumenta constantemente', isCorrect: false },
          { id: 'opt-2', text: 'Siempre existe fricción dinámica', isCorrect: false },
          { id: 'opt-3', text: 'Su velocidad es nula en todo momento', isCorrect: false }
        ]
      },
      {
        id: 'q-005-2',
        number: 2,
        title: 'Pregunta 2',
        statement: 'De acuerdo con F = m · a, si la masa de un objeto se duplica manteniendo la misma fuerza neta, su aceleración:',
        options: [
          { id: 'opt-0', text: 'Se duplica', isCorrect: false },
          { id: 'opt-1', text: 'Se reduce a la mitad', isCorrect: true },
          { id: 'opt-2', text: 'Permanece igual', isCorrect: false },
          { id: 'opt-3', text: 'Se cuadruplica', isCorrect: false }
        ]
      },
      {
        id: 'q-005-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿Cuál es la unidad de medida de la fuerza en el Sistema Internacional (SI)?',
        options: [
          { id: 'opt-0', text: 'Joule (J)', isCorrect: false },
          { id: 'opt-1', text: 'Newton (N)', isCorrect: true },
          { id: 'opt-2', text: 'Pascal (Pa)', isCorrect: false },
          { id: 'opt-3', text: 'Watt (W)', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-006',
    code: 'QUI-106',
    title: 'Química General y Tabla Periódica',
    description: 'Conceptos de átomos, enlaces químicos, configuración electrónica, valencia y reacciones básicas.',
    durationMinutes: 25,
    durationSeconds: 1500,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-006-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Qué partícula subatómica determina el número atómico (Z) de un elemento químico?',
        options: [
          { id: 'opt-0', text: 'El número de protones en el núcleo', isCorrect: true },
          { id: 'opt-1', text: 'El número de neutrones en la corteza', isCorrect: false },
          { id: 'opt-2', text: 'La masa molar total', isCorrect: false },
          { id: 'opt-3', text: 'El número de isótopos naturales', isCorrect: false }
        ]
      },
      {
        id: 'q-006-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Qué tipo de enlace se caracteriza por la compartición de pares de electrones entre átomos?',
        options: [
          { id: 'opt-0', text: 'Enlace covalente', isCorrect: true },
          { id: 'opt-1', text: 'Enlace iónico puro', isCorrect: false },
          { id: 'opt-2', text: 'Puente de hidrógeno intermolecular', isCorrect: false },
          { id: 'opt-3', text: 'Fuerza gravitacional', isCorrect: false }
        ]
      },
      {
        id: 'q-006-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿Cuál es el símbolo químico del sodio en la tabla periódica?',
        options: [
          { id: 'opt-0', text: 'So', isCorrect: false },
          { id: 'opt-1', text: 'Na', isCorrect: true },
          { id: 'opt-2', text: 'S', isCorrect: false },
          { id: 'opt-3', text: 'Sd', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-007',
    code: 'ING-107',
    title: 'Inglés Básico y Estructuras del Presente',
    description: 'Evaluación de vocabulario cotidiano, uso del verbo to be, presente simple y expresiones frecuentes.',
    durationMinutes: 20,
    durationSeconds: 1200,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-007-1',
        number: 1,
        title: 'Pregunta 1',
        statement: 'Choose the correct form to complete: "She ___ to school every morning."',
        options: [
          { id: 'opt-0', text: 'go', isCorrect: false },
          { id: 'opt-1', text: 'goes', isCorrect: true },
          { id: 'opt-2', text: 'going', isCorrect: false },
          { id: 'opt-3', text: 'gone', isCorrect: false }
        ]
      },
      {
        id: 'q-007-2',
        number: 2,
        title: 'Pregunta 2',
        statement: 'Which negative sentence in Present Simple is grammatically correct?',
        options: [
          { id: 'opt-0', text: 'They does not like coffee.', isCorrect: false },
          { id: 'opt-1', text: 'They do not like coffee.', isCorrect: true },
          { id: 'opt-2', text: 'They no likes coffee.', isCorrect: false },
          { id: 'opt-3', text: 'They not liking coffee.', isCorrect: false }
        ]
      },
      {
        id: 'q-007-3',
        number: 3,
        title: 'Pregunta 3',
        statement: 'What is the meaning of "library" in Spanish?',
        options: [
          { id: 'opt-0', text: 'Librería (tienda de libros)', isCorrect: false },
          { id: 'opt-1', text: 'Biblioteca', isCorrect: true },
          { id: 'opt-2', text: 'Laboratorio', isCorrect: false },
          { id: 'opt-3', text: 'Cafetería', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-008',
    code: 'GEO-108',
    title: 'Geografía Física y Cartografía',
    description: 'Preguntas sobre coordenadas geográficas, relieve, climas, hidrografía y lectura de mapas.',
    durationMinutes: 20,
    durationSeconds: 1200,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-008-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Qué línea imaginaria divide la Tierra en los hemisferios norte y sur?',
        options: [
          { id: 'opt-0', text: 'El meridiano de Greenwich', isCorrect: false },
          { id: 'opt-1', text: 'El Ecuador', isCorrect: true },
          { id: 'opt-2', text: 'El Trópico de Capricornio', isCorrect: false },
          { id: 'opt-3', text: 'El círculo polar ártico', isCorrect: false }
        ]
      },
      {
        id: 'q-008-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Qué mide la latitud geográfica de un punto sobre la superficie terrestre?',
        options: [
          { id: 'opt-0', text: 'La distancia angular respecto al Ecuador, hacia el norte o el sur', isCorrect: true },
          { id: 'opt-1', text: 'La altitud sobre el nivel medio del mar', isCorrect: false },
          { id: 'opt-2', text: 'La presión atmosférica local', isCorrect: false },
          { id: 'opt-3', text: 'La temperatura media anual', isCorrect: false }
        ]
      },
      {
        id: 'q-008-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿Qué representa la escala en un mapa cartográfico?',
        options: [
          { id: 'opt-0', text: 'La relación proporcional entre una distancia en el mapa y su distancia real', isCorrect: true },
          { id: 'opt-1', text: 'La cantidad de habitantes de cada ciudad', isCorrect: false },
          { id: 'opt-2', text: 'El pronóstico del clima semanal', isCorrect: false },
          { id: 'opt-3', text: 'La profundidad de los océanos únicamente', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-009',
    code: 'TIC-109',
    title: 'Fundamentos de Computación y Lógica Digital',
    description: 'Evaluación sobre hardware y software, sistemas numéricos, algoritmos básicos y buenas prácticas digitales.',
    durationMinutes: 25,
    durationSeconds: 1500,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-009-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Cuál es la principal característica de la memoria RAM frente al almacenamiento secundario en un computador?',
        options: [
          { id: 'opt-0', text: 'Almacena datos temporalmente para acceso rápido del procesador', isCorrect: true },
          { id: 'opt-1', text: 'Es una unidad óptica externa de respaldo', isCorrect: false },
          { id: 'opt-2', text: 'Sustituye al monitor y al teclado', isCorrect: false },
          { id: 'opt-3', text: 'Funciona únicamente sin energía eléctrica', isCorrect: false }
        ]
      },
      {
        id: 'q-009-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Qué es un algoritmo en informática?',
        options: [
          { id: 'opt-0', text: 'Una secuencia finita y ordenada de pasos para resolver un problema', isCorrect: true },
          { id: 'opt-1', text: 'Un cable de red de fibra óptica', isCorrect: false },
          { id: 'opt-2', text: 'Un tipo de virus informático', isCorrect: false },
          { id: 'opt-3', text: 'El cristal líquido de una pantalla', isCorrect: false }
        ]
      },
      {
        id: 'q-009-3',
        number: 3,
        title: 'Pregunta 3',
        statement: '¿Cuál es el valor decimal del número binario 1010?',
        options: [
          { id: 'opt-0', text: '8', isCorrect: false },
          { id: 'opt-1', text: '10', isCorrect: true },
          { id: 'opt-2', text: '12', isCorrect: false },
          { id: 'opt-3', text: '14', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-010',
    code: 'CIV-110',
    title: 'Educación Cívica y Convivencia Escolar',
    description: 'Principios de participación democrática, deberes y derechos, resolución pacífica de conflictos y ciudadanía.',
    durationMinutes: 20,
    durationSeconds: 1200,
    approvalPercentage: 70,
    questions: [
      {
        id: 'q-010-1',
        number: 1,
        title: 'Pregunta 1',
        statement: '¿Cuál es el propósito central del diálogo y la mediación en la convivencia escolar?',
        options: [
          { id: 'opt-0', text: 'Resolver desacuerdos de forma pacífica y constructiva respetando normas', isCorrect: true },
          { id: 'opt-1', text: 'Imponer decisiones sin escuchar a las partes', isCorrect: false },
          { id: 'opt-2', text: 'Evitar cualquier tipo de acuerdo comunitario', isCorrect: false },
          { id: 'opt-3', text: 'Sustituir el manual de convivencia', isCorrect: false }
        ]
      },
      {
        id: 'q-010-2',
        number: 2,
        title: 'Pregunta 2',
        statement: '¿Qué caracteriza a una participación democrática responsable dentro de la institución educativa?',
        options: [
          { id: 'opt-0', text: 'El respeto por la opinión de los demás y el cumplimiento de acuerdos', isCorrect: true },
          { id: 'opt-1', text: 'La exclusión sistemática de quienes piensan distinto', isCorrect: false },
          { id: 'opt-2', text: 'Ignorar las normas comunes cuando convenga', isCorrect: false },
          { id: 'opt-3', text: 'Impedir la elección de representantes', isCorrect: false }
        ]
      },
      {
        id: 'q-010-3',
        number: 3,
        title: 'Pregunta 3',
        statement: 'En una comunidad educativa, los derechos de cada persona van acompañados de:',
        options: [
          { id: 'opt-0', text: 'Responsabilidades y deberes hacia los demás y el entorno', isCorrect: true },
          { id: 'opt-1', text: 'La ausencia total de normas', isCorrect: false },
          { id: 'opt-2', text: 'El privilegio de afectar el trabajo de otros', isCorrect: false },
          { id: 'opt-3', text: 'Ningún compromiso institucional', isCorrect: false }
        ]
      }
    ]
  }
]);

/**
 * Clona profundamente los datos semilla para evitar mutaciones accidentales sobre las constantes.
 */
export function buildSeedData() {
  return {
    users: SEED_USERS.map((u) => ({ ...u })),
    exams: SEED_EXAMS.map((exam) => ({
      ...exam,
      questions: (exam.questions ?? []).map((q) => ({
        ...q,
        options: (q.options ?? []).map((opt) => ({ ...opt }))
      }))
    }))
  };
}
