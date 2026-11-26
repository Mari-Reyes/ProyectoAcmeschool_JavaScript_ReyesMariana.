# ProyectoAcmeschool_JavaScript_ReyesMariana

# Plataforma de Exámenes - Acme School

Aplicación web desarrollada en JavaScript modular para la gestión y resolución de exámenes en línea de **Acme School**. Permite a administrativos y docentes administrar usuarios y evaluaciones desde un entorno autenticado, mientras que los estudiantes pueden presentar exámenes de forma pública con temporizador en tiempo real y calificación automática.

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
- **Login:** Acceso mediante correo electrónico y contraseña para habilitar los módulos administrativos.
- **Gestión de usuarios:** Creación, visualización, actualización y eliminación (CRUD) de usuarios con roles **Administrador** o **Docente**.
- **Gestión de exámenes:** Creación, visualización, actualización y eliminación de exámenes configurando código, título, duración en minutos, porcentaje de aprobación y descripción.
- **Gestión de preguntas y respuestas:** Asociación de preguntas por examen con opciones de respuesta de selección única, garantizando una respuesta correcta por pregunta.

### Área pública (Sin autenticación)
- **Catálogo de exámenes:** Consulta de exámenes disponibles con su título, duración estimada y porcentaje de aprobación.
- **Registro del estudiante:** Captura y validación de número de identificación y nombre completo antes de iniciar la prueba.
- **Resolución en tiempo real:** Presentación de preguntas numeradas con selección única, temporizador regresivo en tiempo real (`Hr : Min : Seg`) y envío manual o automático al agotarse el tiempo.
- **Calificación inmediata:** Cálculo del porcentaje de aciertos, tiempo restante final y estado (**Aprobado** / **No aprobado**) según el porcentaje mínimo configurado en el examen.

---

## Tecnologías y arquitectura

- **HTML5** semántico y accesible para cada vista del flujo público y privado.
- **CSS3** con variables personalizadas, temas, diseño *responsive* y transiciones.
- **JavaScript (ES Modules)** organizado por módulos y responsabilidades (`auth`, `data`, `modules`, `componets`).
- **Persistencia local:** Almacenamiento en `localStorage` en formato JSON para usuarios, exámenes, sesión activa y resultados/intentos.

---

## Estructura del proyecto

```text
ProyectoAcmeschool_JavaScript_ReyesMariana/
├── index.html
├── portal-academico.html
├── vista-estudiante.html
├── registro-estudiante.html
├── visualizacion-examen.html
├── resultado-estudiante.html
├── perfil-usuario.html
├── gestion-usuarios.html
├── gestion-examenes.html
├── README.md
├── assets/
│   ├── images/
│   └── styles/
│       ├── main.css
│       ├── themes.css
│       └── responsive.css
└── src/
    ├── app.js
    ├── auth/
    │   └── authService.js
    ├── data/
    │   ├── shema.js
    │   └── seed.js
    ├── modules/
    │   ├── users/
    │   │   ├── usersController.js
    │   │   └── usersViews.js
    │   ├── exams/
    │   │   ├── examsControllers.js
    │   │   ├── examsView.js
    │   │   └── questionsManager.js
    │   └── examTaking/
    │       ├── examRunnerController.js
    │       ├── examRunnerView.js
    │       ├── gradingService.js
    │       └── timerService.js
    └── componets/
        ├── exam-card.js
        ├── exam-header.js
        ├── exam-timer.js
        └── toast-alert.js
