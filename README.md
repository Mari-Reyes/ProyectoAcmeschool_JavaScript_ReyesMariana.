# ProyectoAcmeschool_JavaScript_ReyesMariana.

# Plataforma de Exámenes - Acme School

Aplicación web desarrollada en JavaScript modular para la gestión y resolución de exámenes en línea de **Acme School**[span_2](start_span)[span_2](end_span)[span_3](start_span)[span_3](end_span). Permite a administrativos y docentes administrar usuarios y evaluaciones desde un entorno autenticado, mientras que los estudiantes pueden presentar exámenes de forma pública con temporizador en tiempo real y calificación automática[span_4](start_span)[span_4](end_span)[span_5](start_span)[span_5](end_span)[span_6](start_span)[span_6](end_span).

---

## Tabla de contenido

- [Características principales](#características-principales)
- [Tecnologías y arquitectura](#tecnologías-y-arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de datos (JSON)](#modelo-de-datos-json)
- [Instalación y ejecución local](#instalación-y-ejecución-local)
- [Credenciales de acceso inicial](#credenciales-de-acceso-inicial)
- [Autor](#autor)

---

## Características principales

### Área privada (Requiere autenticación)
- **Login:** Acceso mediante correo electrónico y contraseña para habilitar los módulos administrativos[span_7](start_span)[span_7](end_span)[span_8](start_span)[span_8](end_span).
- **Gestión de usuarios:** Creación, visualización en tabla, actualización y eliminación (CRUD) de usuarios con roles **Administrativo** o **Docente**[span_9](start_span)[span_9](end_span).
- **Gestión de exámenes:** Creación, actualización y eliminación de exámenes configurando código, título, tiempo límite en minutos, porcentaje de aprobación y descripción[span_10](start_span)[span_10](end_span).
- **Gestión de preguntas y respuestas:** Asociación de preguntas por examen con múltiples opciones de respuesta, garantizando que **solo exista una respuesta correcta por pregunta**[span_11](start_span)[span_11](end_span).

### Área pública (Sin autenticación)
- **Catálogo de exámenes:** Visualización de exámenes disponibles con su título, tiempo para resolverlo y porcentaje de aprobación[span_12](start_span)[span_12](end_span).
- **Registro del estudiante:** Captura de número de identificación y nombre completo antes de iniciar la prueba[span_13](start_span)[span_13](end_span).
- **Resolución en tiempo real:** Presentación de preguntas numeradas con selección única, reloj regresivo en tiempo real hasta llegar a `0` y botón **Terminar** para entrega anticipada[span_14](start_span)[span_14](end_span)[span_15](start_span)[span_15](end_span).
- **Calificación inmediata:** Cálculo del porcentaje de aciertos y notificación de estado (**Aprobado** / **No aprobado**) según el porcentaje configurado en el examen[span_16](start_span)[span_16](end_span).

---

## Tecnologías y arquitectura

- **HTML5 semántico y accesible**[span_17](start_span)[span_17](end_span)[span_18](start_span)[span_18](end_span)
- **CSS3** (Variables CSS, diseño *responsive* y transiciones/animaciones fluidas)[span_19](start_span)[span_19](end_span)[span_20](start_span)[span_20](end_span)
- **JavaScript (ES Modules)** modularizado por responsabilidades[span_21](start_span)[span_21](end_span)
- **Web Components** (`customElements.define`) para componentes reutilizables de interfaz[span_22](start_span)[span_22](end_span)
- **Persistencia local:** `localStorage` (o `IndexedDB`) con estructura basada en JSON[span_23](start_span)[span_23](end_span)[span_24](start_span)[span_24](end_span)[span_25](start_span)[span_25](end_span)

---

## Estructura del proyecto

```text
ProyectoAcmeschool_JavaScript_ApellidoNombre/
├── index.html
├── README.md
├── assets/
│   └── styles/
│       ├── main.css
│       ├── themes.css
│       └── responsive.css
└── src/
    ├── app.js
    ├── data/
    │   ├── schema.js
    │   └── seed.js
    ├── storage/
    │   └── storageService.js
    ├── auth/
    │   └── authService.js
    ├── modules/
    │   ├── users/
    │   ├── exams/
    │   └── examTaking/
    └── components/
```

### Modelo de datos (JSON)##
La aplicación persiste las siguientes entidades principales en formato JSON:
- Usuarios (users): id (identificación), fullName, email, phone, role (Administrativo | Docente), password.
- Exámenes (exams): id, code, title, durationMinutes, passingPercentage, description, questions.
- Preguntas (questions): id, text, options (id, description, isCorrect).
- Resultados (attempts): id, examId, studentId, studentName, scorePercentage, passed, submittedAt.
- Instalación y ejecución local

```Clona este repositorio:
git clone <URL-de-tu-repositorio-publico>
