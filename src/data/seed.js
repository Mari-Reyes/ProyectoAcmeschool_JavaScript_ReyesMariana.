/**
 * Datos semilla: src/data/seed.js
 * Contiene la cuenta principal de Administrador, 6 usuarios adicionales (Docentes y Administradores)
 * y 10 exámenes completos (con 10 preguntas cada uno) para inicializar la plataforma Acme School.
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
    durationSeconds: 60,
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
      },
      {
        id: 'q-001-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Cuál es la ordenada al origen (intercepto con el eje y) de la recta y = -4x + 9?',
        options: [
          { id: 'opt-0', text: '(0, 9)', isCorrect: true },
          { id: 'opt-1', text: '(0, -4)', isCorrect: false },
          { id: 'opt-2', text: '(9, 0)', isCorrect: false },
          { id: 'opt-3', text: '(-4, 0)', isCorrect: false }
        ]
      },
      {
        id: 'q-001-5',
        number: 5,
        title: 'Pregunta 5',
        statement: 'Si una recta tiene pendiente negativa, ¿cómo es su comportamiento al avanzar de izquierda a derecha?',
        options: [
          { id: 'opt-0', text: 'Es decreciente (baja)', isCorrect: true },
          { id: 'opt-1', text: 'Es creciente (sube)', isCorrect: false },
          { id: 'opt-2', text: 'Es completamente vertical', isCorrect: false },
          { id: 'opt-3', text: 'Es constante y horizontal', isCorrect: false }
        ]
      },
      {
        id: 'q-001-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Cuál es el valor de f(4) en la función f(x) = 2x + 3?',
        options: [
          { id: 'opt-0', text: '9', isCorrect: false },
          { id: 'opt-1', text: '11', isCorrect: true },
          { id: 'opt-2', text: '14', isCorrect: false },
          { id: 'opt-3', text: '7', isCorrect: false }
        ]
      },
      {
        id: 'q-001-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Qué característica comparten dos rectas paralelas no coincidentes en el plano cartesiano?',
        options: [
          { id: 'opt-0', text: 'Tienen la misma pendiente y distinto intercepto en y', isCorrect: true },
          { id: 'opt-1', text: 'Se cortan formando un ángulo de 90 grados', isCorrect: false },
          { id: 'opt-2', text: 'Tienen pendientes opuestas e inversas', isCorrect: false },
          { id: 'opt-3', text: 'Siempre pasan por el origen (0, 0)', isCorrect: false }
        ]
      },
      {
        id: 'q-001-8',
        number: 8,
        title: 'Pregunta 8',
        statement: 'Al resolver la ecuación 5x - 3 = 2x + 9, ¿cuál es el valor de x?',
        options: [
          { id: 'opt-0', text: 'x = 2', isCorrect: false },
          { id: 'opt-1', text: 'x = 4', isCorrect: true },
          { id: 'opt-2', text: 'x = 6', isCorrect: false },
          { id: 'opt-3', text: 'x = 3', isCorrect: false }
        ]
      },
      {
        id: 'q-001-9',
        number: 9,
        title: 'Pregunta 9',
        statement: 'En el sistema x + y = 10 y x - y = 2, ¿cuáles son los valores de x e y respectivamente?',
        options: [
          { id: 'opt-0', text: 'x = 6, y = 4', isCorrect: true },
          { id: 'opt-1', text: 'x = 4, y = 6', isCorrect: false },
          { id: 'opt-2', text: 'x = 8, y = 2', isCorrect: false },
          { id: 'opt-3', text: 'x = 5, y = 5', isCorrect: false }
        ]
      },
      {
        id: 'q-001-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Cuál es la ecuación pendiente-intercepto de una recta con pendiente m = 3 que pasa por (0, -5)?',
        options: [
          { id: 'opt-0', text: 'y = 3x - 5', isCorrect: true },
          { id: 'opt-1', text: 'y = -5x + 3', isCorrect: false },
          { id: 'opt-2', text: 'y = 3x + 5', isCorrect: false },
          { id: 'opt-3', text: 'y = -3x - 5', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-002',
    code: 'LEN-102',
    title: 'Comprensión Lectora y Gramática',
    description: 'Prueba diagnóstica sobre idea principal, inferencia textual, categorías gramaticales y ortografía.',
    durationMinutes: 2,
    durationSeconds: 120,
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
      },
      {
        id: 'q-002-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué es realizar una inferencia en comprensión lectora?',
        options: [
          { id: 'opt-0', text: 'Deducir información implícita a partir de pistas del texto y conocimiento previo', isCorrect: true },
          { id: 'opt-1', text: 'Copiar exactamente la primera oración del primer párrafo', isCorrect: false },
          { id: 'opt-2', text: 'Contar cuántas palabras tiene cada línea', isCorrect: false },
          { id: 'opt-3', text: 'Cambiar el significado literal del diccionario', isCorrect: false }
        ]
      },
      {
        id: 'q-002-5',
        number: 5,
        title: 'Pregunta 5',
        statement: 'En "El agua cristalina corría por el valle", ¿qué categoría gramatical cumple la palabra "cristalina"?',
        options: [
          { id: 'opt-0', text: 'Adjetivo calificativo', isCorrect: true },
          { id: 'opt-1', text: 'Verbo en infinitivo', isCorrect: false },
          { id: 'opt-2', text: 'Conjunción adversativa', isCorrect: false },
          { id: 'opt-3', text: 'Preposición', isCorrect: false }
        ]
      },
      {
        id: 'q-002-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Cuál conector expresa una relación de contraste o adversidad?',
        options: [
          { id: 'opt-0', text: 'sin embargo', isCorrect: true },
          { id: 'opt-1', text: 'asimismo', isCorrect: false },
          { id: 'opt-2', text: 'en primer lugar', isCorrect: false },
          { id: 'opt-3', text: 'por lo tanto', isCorrect: false }
        ]
      },
      {
        id: 'q-002-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Qué tipo de palabra es "lámpara" según su acentuación?',
        options: [
          { id: 'opt-0', text: 'Esdrújula', isCorrect: true },
          { id: 'opt-1', text: 'Aguda', isCorrect: false },
          { id: 'opt-2', text: 'Grave', isCorrect: false },
          { id: 'opt-3', text: 'Monosílaba', isCorrect: false }
        ]
      },
      {
        id: 'q-002-8',
        number: 8,
        title: 'Pregunta 8',
        statement: 'En "María leyó el informe; luego, envió sus observaciones", ¿qué función cumple el punto y coma?',
        options: [
          { id: 'opt-0', text: 'Separar proposiciones estrechamente vinculadas dentro de una misma oración', isCorrect: true },
          { id: 'opt-1', text: 'Indicar que termina el libro completo', isCorrect: false },
          { id: 'opt-2', text: 'Reemplazar todos los signos de interrogación', isCorrect: false },
          { id: 'opt-3', text: 'Marcar una cita textual de otro autor', isCorrect: false }
        ]
      },
      {
        id: 'q-002-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Cuál opción presenta un sinónimo adecuado para "efímero"?',
        options: [
          { id: 'opt-0', text: 'Pasajero o breve', isCorrect: true },
          { id: 'opt-1', text: 'Eterno o perpetuo', isCorrect: false },
          { id: 'opt-2', text: 'Pesado o macizo', isCorrect: false },
          { id: 'opt-3', text: 'Ruidoso o estridente', isCorrect: false }
        ]
      },
      {
        id: 'q-002-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Cuál es la intención comunicativa predominante de un texto argumentativo?',
        options: [
          { id: 'opt-0', text: 'Defender o refutar una postura mediante razones y evidencias', isCorrect: true },
          { id: 'opt-1', text: 'Describir únicamente las medidas de un mueble', isCorrect: false },
          { id: 'opt-2', text: 'Narrar un cuento fantástico sin tesis', isCorrect: false },
          { id: 'opt-3', text: 'Listar ingredientes de una receta', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-003',
    code: 'CIE-103',
    title: 'Biología Celular y Genética Básica',
    description: 'Evaluación sobre organelos celulares, transporte de membrana, mitosis y principios de herencia.',
    durationMinutes: 1,
    durationSeconds: 60,
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
      },
      {
        id: 'q-003-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Cómo se denomina el movimiento pasivo de agua a través de una membrana semipermeable desde menor a mayor concentración de solutos?',
        options: [
          { id: 'opt-0', text: 'Ósmosis', isCorrect: true },
          { id: 'opt-1', text: 'Fagocitosis', isCorrect: false },
          { id: 'opt-2', text: 'Transcripción', isCorrect: false },
          { id: 'opt-3', text: 'Exocitosis', isCorrect: false }
        ]
      },
      {
        id: 'q-003-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Cuál es el resultado principal de la mitosis en una célula somática diploide?',
        options: [
          { id: 'opt-0', text: 'Dos células hijas genéticamente idénticas entre sí y a la célula madre', isCorrect: true },
          { id: 'opt-1', text: 'Cuatro gametos haploides distintos', isCorrect: false },
          { id: 'opt-2', text: 'La eliminación del núcleo celular', isCorrect: false },
          { id: 'opt-3', text: 'La duplicación del tamaño del ribosoma', isCorrect: false }
        ]
      },
      {
        id: 'q-003-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué organelo realiza la fotosíntesis en las células vegetales?',
        options: [
          { id: 'opt-0', text: 'Cloroplasto', isCorrect: true },
          { id: 'opt-1', text: 'Peroxisoma', isCorrect: false },
          { id: 'opt-2', text: 'Centrosoma', isCorrect: false },
          { id: 'opt-3', text: 'Flagelo', isCorrect: false }
        ]
      },
      {
        id: 'q-003-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Cómo se llama el conjunto observable de características físicas de un organismo (como el color de ojos)?',
        options: [
          { id: 'opt-0', text: 'Fenotipo', isCorrect: true },
          { id: 'opt-1', text: 'Cariotipo', isCorrect: false },
          { id: 'opt-2', text: 'Codón', isCorrect: false },
          { id: 'opt-3', text: 'Cromátida', isCorrect: false }
        ]
      },
      {
        id: 'q-003-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿En qué estructura celular se lleva a cabo principalmente la síntesis de proteínas?',
        options: [
          { id: 'opt-0', text: 'En los ribosomas', isCorrect: true },
          { id: 'opt-1', text: 'En la pared celulósica', isCorrect: false },
          { id: 'opt-2', text: 'En el citoplasma vacío', isCorrect: false },
          { id: 'opt-3', text: 'En el centrosoma', isCorrect: false }
        ]
      },
      {
        id: 'q-003-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Qué distingue a una célula eucariota de una célula procariota?',
        options: [
          { id: 'opt-0', text: 'Posee núcleo definido rodeado por envoltura nuclear', isCorrect: true },
          { id: 'opt-1', text: 'Carece de membrana celular y material genético', isCorrect: false },
          { id: 'opt-2', text: 'No realiza ningún tipo de metabolismo', isCorrect: false },
          { id: 'opt-3', text: 'Solo existe en virus', isCorrect: false }
        ]
      },
      {
        id: 'q-003-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Qué son los alelos de un gen?',
        options: [
          { id: 'opt-0', text: 'Diferentes variantes o formas de un mismo gen', isCorrect: true },
          { id: 'opt-1', text: 'Enzimas digestivas del estómago', isCorrect: false },
          { id: 'opt-2', text: 'Tipos de tejidos musculares', isCorrect: false },
          { id: 'opt-3', text: 'Moléculas de agua intracelular', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-004',
    code: 'HIS-104',
    title: 'Historia Universal y Procesos Contemporáneos',
    description: 'Repaso de revoluciones políticas, industrialización, guerras mundiales y organización internacional.',
    durationMinutes: 2,
    durationSeconds: 120,
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
      },
      {
        id: 'q-004-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué acontecimiento suele señalarse como el inicio simbólico de la Revolución Francesa en 1789?',
        options: [
          { id: 'opt-0', text: 'La toma de la Bastilla', isCorrect: true },
          { id: 'opt-1', text: 'La firma del Tratado de Westfalia', isCorrect: false },
          { id: 'opt-2', text: 'La caída del Muro de Berlín', isCorrect: false },
          { id: 'opt-3', text: 'La llegada a la Luna', isCorrect: false }
        ]
      },
      {
        id: 'q-004-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Qué organización internacional se creó en 1945 para fomentar la cooperación y la paz tras la Segunda Guerra Mundial?',
        options: [
          { id: 'opt-0', text: 'La Organización de las Naciones Unidas (ONU)', isCorrect: true },
          { id: 'opt-1', text: 'La Liga Hanseática', isCorrect: false },
          { id: 'opt-2', text: 'La Santa Alianza', isCorrect: false },
          { id: 'opt-3', text: 'El Imperio Austro-Húngaro', isCorrect: false }
        ]
      },
      {
        id: 'q-004-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué se conoce históricamente como la Guerra Fría?',
        options: [
          { id: 'opt-0', text: 'El período de tensión geopolítica, ideológica y armamentística entre EE. UU. y la URSS sin enfrentamiento directo total', isCorrect: true },
          { id: 'opt-1', text: 'Una guerra ocurrida exclusivamente en el polo sur durante el siglo XVII', isCorrect: false },
          { id: 'opt-2', text: 'El conflicto entre Atenas y Esparta', isCorrect: false },
          { id: 'opt-3', text: 'La conquista de Britania por los romanos', isCorrect: false }
        ]
      },
      {
        id: 'q-004-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Qué representó la caída del Muro de Berlín en 1989?',
        options: [
          { id: 'opt-0', text: 'El fin de la división física de Berlín y un hito del cierre de la Guerra Fría en Europa', isCorrect: true },
          { id: 'opt-1', text: 'El comienzo de la Edad Media', isCorrect: false },
          { id: 'opt-2', text: 'La fundación de la imprenta de tipos móviles', isCorrect: false },
          { id: 'opt-3', text: 'El inicio de la Revolución Agrícola neolítica', isCorrect: false }
        ]
      },
      {
        id: 'q-004-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Cuál es una característica central del Estado de derecho moderno?',
        options: [
          { id: 'opt-0', text: 'La sumisión de gobernantes y ciudadanos a la ley y la separación de poderes', isCorrect: true },
          { id: 'opt-1', text: 'La concentración absoluta de todo poder en una sola persona sin límites', isCorrect: false },
          { id: 'opt-2', text: 'La inexistencia de derechos civiles', isCorrect: false },
          { id: 'opt-3', text: 'La prohibición de elecciones periódicas', isCorrect: false }
        ]
      },
      {
        id: 'q-004-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Qué proceso histórico favoreció el paso de sociedades mayoritariamente rurales a urbanas durante los siglos XVIII y XIX?',
        options: [
          { id: 'opt-0', text: 'La industrialización y el crecimiento de los centros fabriles y comerciales', isCorrect: true },
          { id: 'opt-1', text: 'El abandono total de las ciudades', isCorrect: false },
          { id: 'opt-2', text: 'La desaparición del ferrocarril y el telégrafo', isCorrect: false },
          { id: 'opt-3', text: 'La prohibición del trabajo asalariado', isCorrect: false }
        ]
      },
      {
        id: 'q-004-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Qué proclamó la Declaración Universal de los Derechos Humanos de 1948?',
        options: [
          { id: 'opt-0', text: 'Derechos y libertades fundamentales inherentes a todas las personas sin discriminación', isCorrect: true },
          { id: 'opt-1', text: 'Privilegios exclusivos para un solo país', isCorrect: false },
          { id: 'opt-2', text: 'Normas únicamente para el comercio marítimo', isCorrect: false },
          { id: 'opt-3', text: 'La abolición de la educación pública en todo el mundo', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-005',
    code: 'FIS-105',
    title: 'Cinemática y Leyes de Newton',
    description: 'Evaluación sobre movimiento rectilíneo, aceleración, fuerza neta, inercia y acción-reacción.',
    durationMinutes: 1,
    durationSeconds: 60,
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
      },
      {
        id: 'q-005-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué establece la Tercera Ley de Newton (acción y reacción)?',
        options: [
          { id: 'opt-0', text: 'Si un cuerpo A ejerce una fuerza sobre B, B ejerce sobre A una fuerza de igual magnitud y sentido opuesto', isCorrect: true },
          { id: 'opt-1', text: 'Toda fuerza produce siempre movimiento circular', isCorrect: false },
          { id: 'opt-2', text: 'La reacción ocurre siempre antes que la acción', isCorrect: false },
          { id: 'opt-3', text: 'Las fuerzas de acción y reacción actúan sobre el mismo objeto anulándose entre sí', isCorrect: false }
        ]
      },
      {
        id: 'q-005-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Cuál es la velocidad media de un móvil que recorre 120 metros en 6 segundos con rapidez constante?',
        options: [
          { id: 'opt-0', text: '20 m/s', isCorrect: true },
          { id: 'opt-1', text: '720 m/s', isCorrect: false },
          { id: 'opt-2', text: '0.05 m/s', isCorrect: false },
          { id: 'opt-3', text: '126 m/s', isCorrect: false }
        ]
      },
      {
        id: 'q-005-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué magnitud física mide la resistencia de un cuerpo a cambiar su estado de movimiento?',
        options: [
          { id: 'opt-0', text: 'La inercia (asociada a la masa)', isCorrect: true },
          { id: 'opt-1', text: 'La temperatura', isCorrect: false },
          { id: 'opt-2', text: 'La frecuencia', isCorrect: false },
          { id: 'opt-3', text: 'La densidad óptica', isCorrect: false }
        ]
      },
      {
        id: 'q-005-7',
        number: 7,
        title: 'Pregunta 7',
        statement: 'En un Movimiento Rectilíneo Uniforme (MRU), la aceleración es:',
        options: [
          { id: 'opt-0', text: 'Cero (velocidad constante)', isCorrect: true },
          { id: 'opt-1', text: 'Siempre creciente', isCorrect: false },
          { id: 'opt-2', text: 'Igual a 9.8 m/s²', isCorrect: false },
          { id: 'opt-3', text: 'Variable cada segundo', isCorrect: false }
        ]
      },
      {
        id: 'q-005-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Cuál es la diferencia fundamental entre masa y peso?',
        options: [
          { id: 'opt-0', text: 'La masa mide cantidad de materia y es escalar; el peso es la fuerza gravitatoria sobre esa masa', isCorrect: true },
          { id: 'opt-1', text: 'El peso se mide en kilogramos y la masa en newtons', isCorrect: false },
          { id: 'opt-2', text: 'La masa cambia en la Luna pero el peso nunca cambia', isCorrect: false },
          { id: 'opt-3', text: 'Son exactamente la misma magnitud física', isCorrect: false }
        ]
      },
      {
        id: 'q-005-9',
        number: 9,
        title: 'Pregunta 9',
        statement: 'Si un objeto parte del reposo y acelera a 3 m/s² durante 4 segundos, ¿qué velocidad alcanza?',
        options: [
          { id: 'opt-0', text: '12 m/s', isCorrect: true },
          { id: 'opt-1', text: '7 m/s', isCorrect: false },
          { id: 'opt-2', text: '1.33 m/s', isCorrect: false },
          { id: 'opt-3', text: '24 m/s', isCorrect: false }
        ]
      },
      {
        id: 'q-005-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿En qué dirección actúa habitualmente la fuerza de rozamiento cinético sobre un bloque que desliza?',
        options: [
          { id: 'opt-0', text: 'En sentido opuesto al movimiento relativo de deslizamiento', isCorrect: true },
          { id: 'opt-1', text: 'Siempre hacia arriba perpendicular al suelo', isCorrect: false },
          { id: 'opt-2', text: 'A favor de la aceleración del bloque', isCorrect: false },
          { id: 'opt-3', text: 'Hacia el centro de la Tierra únicamente', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-006',
    code: 'QUI-106',
    title: 'Química General y Tabla Periódica',
    description: 'Conceptos de átomos, enlaces químicos, configuración electrónica, valencia y reacciones básicas.',
    durationMinutes: 2,
    durationSeconds: 120,
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
      },
      {
        id: 'q-006-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué partículas se encuentran dentro del núcleo atómico?',
        options: [
          { id: 'opt-0', text: 'Protones y neutrones', isCorrect: true },
          { id: 'opt-1', text: 'Electrones y fotones', isCorrect: false },
          { id: 'opt-2', text: 'Solo electrones', isCorrect: false },
          { id: 'opt-3', text: 'Neutrinos y positrones únicamente', isCorrect: false }
        ]
      },
      {
        id: 'q-006-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Cómo se denominan los átomos de un mismo elemento que tienen distinto número de neutrones?',
        options: [
          { id: 'opt-0', text: 'Isótopos', isCorrect: true },
          { id: 'opt-1', text: 'Alótropos', isCorrect: false },
          { id: 'opt-2', text: 'Catalizadores', isCorrect: false },
          { id: 'opt-3', text: 'Sales binarias', isCorrect: false }
        ]
      },
      {
        id: 'q-006-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué indican las filas horizontales (períodos) en la tabla periódica moderna?',
        options: [
          { id: 'opt-0', text: 'El nivel energético principal más externo ocupado por electrones en estado basal', isCorrect: true },
          { id: 'opt-1', text: 'La cantidad de moléculas de agua que forman', isCorrect: false },
          { id: 'opt-2', text: 'El punto de fusión en grados Fahrenheit únicamente', isCorrect: false },
          { id: 'opt-3', text: 'La masa en gramos de un mol de oxígeno', isCorrect: false }
        ]
      },
      {
        id: 'q-006-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Cuál es la fórmula química del agua?',
        options: [
          { id: 'opt-0', text: 'H₂O', isCorrect: true },
          { id: 'opt-1', text: 'CO₂', isCorrect: false },
          { id: 'opt-2', text: 'NaCl', isCorrect: false },
          { id: 'opt-3', text: 'CH₄', isCorrect: false }
        ]
      },
      {
        id: 'q-006-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Qué caracteriza a un enlace iónico típico?',
        options: [
          { id: 'opt-0', text: 'Transferencia de electrones entre un metal y un no metal con atracción electrostática de iones', isCorrect: true },
          { id: 'opt-1', text: 'Unión exclusiva entre dos gases nobles', isCorrect: false },
          { id: 'opt-2', text: 'Ausencia total de carga eléctrica en los iones', isCorrect: false },
          { id: 'opt-3', text: 'Reacción nuclear de fisión', isCorrect: false }
        ]
      },
      {
        id: 'q-006-9',
        number: 9,
        title: 'Pregunta 9',
        statement: 'Según la ley de conservación de la masa en una reacción química cerrada:',
        options: [
          { id: 'opt-0', text: 'La masa total de los reactivos es igual a la masa total de los productos', isCorrect: true },
          { id: 'opt-1', text: 'La masa siempre se duplica al formarse un compuesto', isCorrect: false },
          { id: 'opt-2', text: 'Los átomos desaparecen por completo', isCorrect: false },
          { id: 'opt-3', text: 'Solo aplica a reacciones endotérmicas', isCorrect: false }
        ]
      },
      {
        id: 'q-006-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Qué valor de pH corresponde a una disolución neutra a 25 °C?',
        options: [
          { id: 'opt-0', text: '7', isCorrect: true },
          { id: 'opt-1', text: '1', isCorrect: false },
          { id: 'opt-2', text: '14', isCorrect: false },
          { id: 'opt-3', text: '0', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-007',
    code: 'ING-107',
    title: 'Inglés Básico y Estructuras del Presente',
    description: 'Evaluación de vocabulario cotidiano, uso del verbo to be, presente simple y expresiones frecuentes.',
    durationMinutes: 1,
    durationSeconds: 60,
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
      },
      {
        id: 'q-007-4',
        number: 4,
        title: 'Pregunta 4',
        statement: 'Complete the sentence with the correct form of "to be": "We ___ ready for the exam."',
        options: [
          { id: 'opt-0', text: 'are', isCorrect: true },
          { id: 'opt-1', text: 'is', isCorrect: false },
          { id: 'opt-2', text: 'am', isCorrect: false },
          { id: 'opt-3', text: 'be', isCorrect: false }
        ]
      },
      {
        id: 'q-007-5',
        number: 5,
        title: 'Pregunta 5',
        statement: 'Which question word is used to ask about a place?',
        options: [
          { id: 'opt-0', text: 'Where', isCorrect: true },
          { id: 'opt-1', text: 'Who', isCorrect: false },
          { id: 'opt-2', text: 'When', isCorrect: false },
          { id: 'opt-3', text: 'Why', isCorrect: false }
        ]
      },
      {
        id: 'q-007-6',
        number: 6,
        title: 'Pregunta 6',
        statement: 'Choose the correct Present Continuous sentence for an action happening right now:',
        options: [
          { id: 'opt-0', text: 'He is reading a book right now.', isCorrect: true },
          { id: 'opt-1', text: 'He read a book yesterday every day.', isCorrect: false },
          { id: 'opt-2', text: 'He are reading a book.', isCorrect: false },
          { id: 'opt-3', text: 'He reading a book now.', isCorrect: false }
        ]
      },
      {
        id: 'q-007-7',
        number: 7,
        title: 'Pregunta 7',
        statement: 'What is the plural form of "child"?',
        options: [
          { id: 'opt-0', text: 'children', isCorrect: true },
          { id: 'opt-1', text: 'childs', isCorrect: false },
          { id: 'opt-2', text: 'childrens', isCorrect: false },
          { id: 'opt-3', text: 'childes', isCorrect: false }
        ]
      },
      {
        id: 'q-007-8',
        number: 8,
        title: 'Pregunta 8',
        statement: 'Choose the correct possessive adjective: "Sarah has a new laptop. ___ laptop is silver."',
        options: [
          { id: 'opt-0', text: 'Her', isCorrect: true },
          { id: 'opt-1', text: 'His', isCorrect: false },
          { id: 'opt-2', text: 'Their', isCorrect: false },
          { id: 'opt-3', text: 'Our', isCorrect: false }
        ]
      },
      {
        id: 'q-007-9',
        number: 9,
        title: 'Pregunta 9',
        statement: 'How do you say "Buenos días" in English?',
        options: [
          { id: 'opt-0', text: 'Good morning', isCorrect: true },
          { id: 'opt-1', text: 'Good night', isCorrect: false },
          { id: 'opt-2', text: 'See you later', isCorrect: false },
          { id: 'opt-3', text: 'Good afternoon', isCorrect: false }
        ]
      },
      {
        id: 'q-007-10',
        number: 10,
        title: 'Pregunta 10',
        statement: 'Complete: "___ your brother play soccer on weekends?"',
        options: [
          { id: 'opt-0', text: 'Does', isCorrect: true },
          { id: 'opt-1', text: 'Do', isCorrect: false },
          { id: 'opt-2', text: 'Is', isCorrect: false },
          { id: 'opt-3', text: 'Are', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-008',
    code: 'GEO-108',
    title: 'Geografía Física y Cartografía',
    description: 'Preguntas sobre coordenadas geográficas, relieve, climas, hidrografía y lectura de mapas.',
    durationMinutes: 2,
    durationSeconds: 120,
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
      },
      {
        id: 'q-008-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué mide la longitud geográfica?',
        options: [
          { id: 'opt-0', text: 'La distancia angular respecto al meridiano de Greenwich, hacia el este o el oeste', isCorrect: true },
          { id: 'opt-1', text: 'La humedad relativa del aire', isCorrect: false },
          { id: 'opt-2', text: 'La velocidad del viento', isCorrect: false },
          { id: 'opt-3', text: 'La profundidad de un río', isCorrect: false }
        ]
      },
      {
        id: 'q-008-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Cómo se define la altitud de un lugar?',
        options: [
          { id: 'opt-0', text: 'La distancia vertical medida desde el nivel medio del mar', isCorrect: true },
          { id: 'opt-1', text: 'La distancia horizontal hasta la costa más cercana', isCorrect: false },
          { id: 'opt-2', text: 'La duración del día solar', isCorrect: false },
          { id: 'opt-3', text: 'El número de montañas de un país', isCorrect: false }
        ]
      },
      {
        id: 'q-008-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué es una cuenca hidrográfica?',
        options: [
          { id: 'opt-0', text: 'Un territorio drenado por un río principal y sus afluentes hacia un mismo colector', isCorrect: true },
          { id: 'opt-1', text: 'Un cráter volcánico inactivo', isCorrect: false },
          { id: 'opt-2', text: 'Una capa de nubes en la estratosfera', isCorrect: false },
          { id: 'opt-3', text: 'Un tipo de roca sedimentaria', isCorrect: false }
        ]
      },
      {
        id: 'q-008-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Qué elemento de un mapa explica el significado de los símbolos, colores y trazos utilizados?',
        options: [
          { id: 'opt-0', text: 'La leyenda', isCorrect: true },
          { id: 'opt-1', text: 'La marea', isCorrect: false },
          { id: 'opt-2', text: 'La isobara', isCorrect: false },
          { id: 'opt-3', text: 'El solsticio', isCorrect: false }
        ]
      },
      {
        id: 'q-008-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Qué suele ocurrir con la temperatura media al ascender en altitud dentro de la troposfera?',
        options: [
          { id: 'opt-0', text: 'Tiende a disminuir', isCorrect: true },
          { id: 'opt-1', text: 'Aumenta siempre 20 °C por cada metro', isCorrect: false },
          { id: 'opt-2', text: 'Se vuelve igual en todos los planetas', isCorrect: false },
          { id: 'opt-3', text: 'No cambia nunca en ninguna montaña', isCorrect: false }
        ]
      },
      {
        id: 'q-008-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Qué es una cordillera?',
        options: [
          { id: 'opt-0', text: 'Una sucesión o cadena de montañas enlazadas entre sí', isCorrect: true },
          { id: 'opt-1', text: 'Una llanura inundable sin elevaciones', isCorrect: false },
          { id: 'opt-2', text: 'Un estrecho canal artificial', isCorrect: false },
          { id: 'opt-3', text: 'Un desierto polar submarino', isCorrect: false }
        ]
      },
      {
        id: 'q-008-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿A qué se denomina clima de una región?',
        options: [
          { id: 'opt-0', text: 'Al patrón promedio y habitual de las condiciones atmosféricas a lo largo de largos períodos', isCorrect: true },
          { id: 'opt-1', text: 'A la lluvia que cae en un solo minuto', isCorrect: false },
          { id: 'opt-2', text: 'A la rotación diaria de la Tierra', isCorrect: false },
          { id: 'opt-3', text: 'A la composición química del suelo', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-009',
    code: 'TIC-109',
    title: 'Fundamentos de Computación y Lógica Digital',
    description: 'Evaluación sobre hardware y software, sistemas numéricos, algoritmos básicos y buenas prácticas digitales.',
    durationMinutes: 1,
    durationSeconds: 60,
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
      },
      {
        id: 'q-009-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué es el software de sistema?',
        options: [
          { id: 'opt-0', text: 'El software que gestiona el hardware y sirve de base para ejecutar programas, como el sistema operativo', isCorrect: true },
          { id: 'opt-1', text: 'El carcasa metálica del gabinete', isCorrect: false },
          { id: 'opt-2', text: 'Un archivo de imagen comprimido', isCorrect: false },
          { id: 'opt-3', text: 'El cable de alimentación eléctrica', isCorrect: false }
        ]
      },
      {
        id: 'q-009-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Cuántos bits forman un byte estándar?',
        options: [
          { id: 'opt-0', text: '8 bits', isCorrect: true },
          { id: 'opt-1', text: '4 bits', isCorrect: false },
          { id: 'opt-2', text: '16 bits', isCorrect: false },
          { id: 'opt-3', text: '100 bits', isCorrect: false }
        ]
      },
      {
        id: 'q-009-6',
        number: 6,
        title: 'Pregunta 6',
        statement: 'En lógica booleana, ¿cuándo es verdadera la operación conjunción (A AND B)?',
        options: [
          { id: 'opt-0', text: 'Únicamente cuando tanto A como B son verdaderos', isCorrect: true },
          { id: 'opt-1', text: 'Cuando ambos son falsos', isCorrect: false },
          { id: 'opt-2', text: 'Siempre, sin importar el valor de A y B', isCorrect: false },
          { id: 'opt-3', text: 'Solo cuando A es falso y B es verdadero', isCorrect: false }
        ]
      },
      {
        id: 'q-009-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Cuál es una buena práctica de seguridad digital al crear contraseñas?',
        options: [
          { id: 'opt-0', text: 'Usar contraseñas largas, únicas por servicio y combinar distintos tipos de caracteres', isCorrect: true },
          { id: 'opt-1', text: 'Repetir la misma contraseña sencilla en todas las cuentas', isCorrect: false },
          { id: 'opt-2', text: 'Compartir públicamente la clave en foros abiertos', isCorrect: false },
          { id: 'opt-3', text: 'Usar siempre "123456"', isCorrect: false }
        ]
      },
      {
        id: 'q-009-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Qué estructura de control permite repetir un bloque de instrucciones mientras se cumpla una condición?',
        options: [
          { id: 'opt-0', text: 'Un bucle o ciclo (como while o for)', isCorrect: true },
          { id: 'opt-1', text: 'Un comentario de texto', isCorrect: false },
          { id: 'opt-2', text: 'Una constante vacía', isCorrect: false },
          { id: 'opt-3', text: 'Un puerto USB', isCorrect: false }
        ]
      },
      {
        id: 'q-009-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Qué representa el número binario 0101 en sistema decimal?',
        options: [
          { id: 'opt-0', text: '5', isCorrect: true },
          { id: 'opt-1', text: '3', isCorrect: false },
          { id: 'opt-2', text: '9', isCorrect: false },
          { id: 'opt-3', text: '15', isCorrect: false }
        ]
      },
      {
        id: 'q-009-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Qué es el phishing en el ámbito de la ciberseguridad?',
        options: [
          { id: 'opt-0', text: 'Un intento de engaño (por correo, mensaje o sitio falso) para obtener credenciales o datos sensibles', isCorrect: true },
          { id: 'opt-1', text: 'Una herramienta para limpiar el polvo del teclado', isCorrect: false },
          { id: 'opt-2', text: 'Un formato de imagen sin compresión', isCorrect: false },
          { id: 'opt-3', text: 'Un tipo de batería recargable', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'exam-010',
    code: 'CIV-110',
    title: 'Educación Cívica y Convivencia Escolar',
    description: 'Principios de participación democrática, deberes y derechos, resolución pacífica de conflictos y ciudadanía.',
    durationMinutes: 2,
    durationSeconds: 120,
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
      },
      {
        id: 'q-010-4',
        number: 4,
        title: 'Pregunta 4',
        statement: '¿Qué implica la empatía en la resolución de conflictos cotidianos?',
        options: [
          { id: 'opt-0', text: 'Intentar comprender la perspectiva y sentimientos de la otra persona sin descalificarla', isCorrect: true },
          { id: 'opt-1', text: 'Dar siempre la razón sin analizar los hechos', isCorrect: false },
          { id: 'opt-2', text: 'Evitar escuchar a quien tiene una opinión distinta', isCorrect: false },
          { id: 'opt-3', text: 'Responder con agresividad verbal', isCorrect: false }
        ]
      },
      {
        id: 'q-010-5',
        number: 5,
        title: 'Pregunta 5',
        statement: '¿Qué función cumple el voto en un proceso de elección estudiantil?',
        options: [
          { id: 'opt-0', text: 'Expresar de forma libre y secreta la preferencia de cada elector', isCorrect: true },
          { id: 'opt-1', text: 'Obligar a todos a pensar igual', isCorrect: false },
          { id: 'opt-2', text: 'Anular las reglas de la convocatoria', isCorrect: false },
          { id: 'opt-3', text: 'Sustituir el debate previo', isCorrect: false }
        ]
      },
      {
        id: 'q-010-6',
        number: 6,
        title: 'Pregunta 6',
        statement: '¿Qué conducta favorece el cuidado de los bienes comunes en el colegio?',
        options: [
          { id: 'opt-0', text: 'Cuidar las instalaciones, materiales y espacios compartidos como propios de la comunidad', isCorrect: true },
          { id: 'opt-1', text: 'Dañar el mobiliario porque es de uso público', isCorrect: false },
          { id: 'opt-2', text: 'Dejar residuos fuera de su lugar sin importar el entorno', isCorrect: false },
          { id: 'opt-3', text: 'Apropiarse de recursos de uso colectivo', isCorrect: false }
        ]
      },
      {
        id: 'q-010-7',
        number: 7,
        title: 'Pregunta 7',
        statement: '¿Qué es la inclusión dentro del entorno escolar?',
        options: [
          { id: 'opt-0', text: 'Garantizar que todas las personas participen, aprendan y sean valoradas en igualdad de dignidad', isCorrect: true },
          { id: 'opt-1', text: 'Formar grupos cerrados que excluyen a compañeros', isCorrect: false },
          { id: 'opt-2', text: 'Bloquear el acceso a actividades comunes', isCorrect: false },
          { id: 'opt-3', text: 'Uniformar a todos sin respetar su dignidad', isCorrect: false }
        ]
      },
      {
        id: 'q-010-8',
        number: 8,
        title: 'Pregunta 8',
        statement: '¿Qué papel tiene la escucha activa durante una conversación para aclarar un malentendido?',
        options: [
          { id: 'opt-0', text: 'Prestar atención plena, evitar interrumpir y verificar lo que el otro quiso decir', isCorrect: true },
          { id: 'opt-1', text: 'Preparar la respuesta mientras se ignora el mensaje', isCorrect: false },
          { id: 'opt-2', text: 'Hablar en voz más alta para imponerse', isCorrect: false },
          { id: 'opt-3', text: 'Sacar conclusiones antes de terminar de oír', isCorrect: false }
        ]
      },
      {
        id: 'q-010-9',
        number: 9,
        title: 'Pregunta 9',
        statement: '¿Por qué es importante el respeto a la diversidad en una sociedad democrática?',
        options: [
          { id: 'opt-0', text: 'Porque enriquece la convivencia y protege los derechos de todas las personas', isCorrect: true },
          { id: 'opt-1', text: 'Porque impide crear normas comunes', isCorrect: false },
          { id: 'opt-2', text: 'Porque elimina la responsabilidad individual', isCorrect: false },
          { id: 'opt-3', text: 'Porque justifica tratos discriminatorios', isCorrect: false }
        ]
      },
      {
        id: 'q-010-10',
        number: 10,
        title: 'Pregunta 10',
        statement: '¿Cuál es el primer paso constructivo ante un conflicto interpersonal en el aula?',
        options: [
          { id: 'opt-0', text: 'Calmar los ánimos, identificar el problema y buscar una solución justa mediante el diálogo', isCorrect: true },
          { id: 'opt-1', text: 'Difundir rumores para involucrar a más personas', isCorrect: false },
          { id: 'opt-2', text: 'Recurrir a agresiones físicas o verbales', isCorrect: false },
          { id: 'opt-3', text: 'Negar cualquier responsabilidad propia', isCorrect: false }
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

