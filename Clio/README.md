Clio - Validador de Hechos Históricos con IA

Aplicación web full-stack que utiliza inteligencia artificial (Google Gemini) para analizar afirmaciones históricas y clasificarlas como veraces, dudosas o falsas, proporcionando una explicación y términos clave relacionados con el contenido analizado.

📋 Tabla de Contenidos
Descripción General
Objetivo
Características
Manual de Usuario
Instalación
Configuración de la Base de Datos
Configuración del Backend
Configuración del Frontend
Stack Tecnológico
Arquitectura del Sistema
Estructura del Proyecto
API REST
Seguridad
Base de Datos
Auditoría y Trazabilidad
Roles y Permisos
Equipo
Limitaciones
Licencia
🎯 Descripción General

Clio es una aplicación web educativa orientada a la verificación de información histórica mediante inteligencia artificial.

El sistema permite que los usuarios ingresen afirmaciones o textos históricos para obtener un análisis automatizado mediante Google Gemini.

El resultado se presenta mediante un sistema de semáforo:

🟢 Veraz: la afirmación presenta información históricamente correcta.
🟡 Dudoso: la afirmación contiene información parcialmente correcta, ambigua o que requiere verificación.
🔴 Falso: la afirmación presenta información que contradice hechos históricos conocidos.

Además del análisis mediante IA, Clio permite almacenar y consultar el historial de análisis, editar y eliminar registros, administrar usuarios y consultar información estadística y de auditoría según el rol del usuario.

🎯 Objetivo

El objetivo de Clio es proporcionar una herramienta educativa que facilite la identificación y análisis de posibles afirmaciones históricas falsas mediante inteligencia artificial.

La aplicación busca servir como herramienta de apoyo para la investigación, sin reemplazar la consulta de fuentes históricas confiables.

✨ Características
Usuario estándar
Registro de usuarios.
Inicio de sesión mediante credenciales.
Autenticación mediante JWT.
Análisis de textos históricos mediante Google Gemini.
Clasificación mediante semáforo de veracidad.
Explicación del resultado.
Extracción de términos clave.
Historial de análisis.
Edición de análisis.
Eliminación lógica de análisis.
Visualización de resultados anteriores.
Administrador
Acceso al panel administrativo.
Visualización de estadísticas generales.
Consulta de información de auditoría.
Gestión de usuarios.
Control de acceso basado en roles.
Consulta de reportes del sistema.
📘 Manual de Usuario
1. Registro de usuario

Para utilizar Clio por primera vez:

Abrir la aplicación.
Seleccionar la opción Registrarse.
Ingresar:
Nombre.
Apellido.
Correo electrónico.
Contraseña.
Presionar el botón Registrarse.
El sistema valida la información.
Si los datos son correctos, se crea la cuenta.

La contraseña se almacena utilizando un mecanismo de hash mediante bcryptjs.

2. Inicio de sesión
Abrir Clio.
Ingresar el correo electrónico.
Ingresar la contraseña.
Presionar Iniciar sesión.
El backend valida las credenciales.
Si son correctas, se genera un token JWT.
El usuario accede a la aplicación.

Si las credenciales son incorrectas, el sistema muestra un mensaje de error.

3. Analizar un texto histórico

Una vez iniciada la sesión:

Acceder al panel de análisis.
Escribir o pegar una afirmación histórica.
Presionar el botón Analizar.
El sistema valida que el contenido no esté vacío.
El backend envía la información a Google Gemini.
La IA procesa el contenido.
Se obtiene:
Veredicto.
Explicación.
Términos clave.
El sistema almacena el análisis.
El resultado se muestra en pantalla.
Ejemplo
La Revolución Francesa comenzó en 1789 con la toma de la Bastilla.

El sistema devolverá un resultado similar a:

Veredicto: Veraz


Explicación:
La Revolución Francesa comenzó en 1789 y la toma de la Bastilla
ocurrió el 14 de julio del mismo año.


Términos clave:
- Revolución Francesa
- 1789
- Bastilla
4. Interpretación del semáforo
🟢 Veraz

Indica que la información analizada coincide con hechos históricos conocidos.

🟡 Dudoso

Indica que la información contiene elementos que requieren contexto, precisión o una verificación adicional.

🔴 Falso

Indica que la información analizada contradice hechos históricos conocidos.

Importante: El resultado generado por inteligencia artificial no debe considerarse una fuente histórica absoluta. Se recomienda contrastar la información con fuentes académicas y bibliográficas confiables.

5. Consultar el historial

El usuario puede consultar los análisis realizados anteriormente.

El historial permite visualizar:

Texto analizado.
Veredicto.
Explicación.
Términos clave.
Fecha del análisis.

Los análisis eliminados mediante eliminación lógica no aparecen en el historial visible.

6. Editar un análisis

Para modificar un análisis:

Seleccionar un análisis del historial.
Presionar la opción Editar.
Modificar el texto.
Guardar los cambios.
El sistema vuelve a enviar el contenido a la IA.
Se genera un nuevo veredicto.
Se actualiza el análisis existente.

El identificador original del análisis se conserva.

7. Eliminar un análisis

Para eliminar un análisis:

Seleccionar el análisis.
Presionar Eliminar.
Confirmar la operación.
El sistema marca el registro como eliminado.
El análisis deja de mostrarse en el historial.

La información no se elimina físicamente de la base de datos cuando se utiliza eliminación lógica, permitiendo conservar la trazabilidad del registro.

👨‍💼 Funciones del Administrador

Los usuarios con rol admin tienen acceso a funcionalidades adicionales.

Panel administrativo

El administrador puede consultar información general del sistema, incluyendo estadísticas relacionadas con los análisis realizados.

Auditoría

El administrador puede consultar los registros de auditoría generados por las operaciones realizadas sobre los datos.

La auditoría permite conocer:

Usuario que realizó la operación.
Fecha y hora.
Tipo de operación.
Datos anteriores.
Datos nuevos.
Registro afectado.
Gestión de usuarios

El administrador puede gestionar los usuarios registrados y sus roles de acuerdo con los permisos implementados en el sistema.

🚀 Instalación
Requisitos previos

Antes de instalar Clio se necesita:

Herramienta	Versión recomendada
Node.js	18 o superior
npm	9 o superior
PostgreSQL	12 o superior
Git	Versión actual
Navegador web	Chrome, Edge, Firefox u otro navegador moderno

Verificar las versiones:

node --version
npm --version
psql --version
git --version
📥 Clonar el repositorio

Clonar el proyecto:

git clone <URL_DEL_REPOSITORIO>

Ingresar a la carpeta:

cd Clio
🗄️ Configuración de la Base de Datos

Clio utiliza PostgreSQL como sistema gestor de base de datos.

1. Crear la base de datos

Ingresar a PostgreSQL:

psql -U postgres

Crear la base:

CREATE DATABASE ClioUser;

Crear el usuario de la aplicación:

CREATE USER clio WITH PASSWORD 'CAMBIAR_ESTA_CONTRASEÑA';

Asignar permisos:

GRANT ALL PRIVILEGES ON DATABASE ClioUser TO clio;

Ingresar a la base:

\c ClioUser

Asignar permisos sobre el esquema:

GRANT ALL ON SCHEMA public TO clio;
2. Ejecutar el esquema

Desde la raíz del proyecto:

psql -U clio -d ClioUser -f backend/src/sql/schema.sql

Para verificar las tablas:

psql -U clio -d ClioUser -c "\dt"

Entre las tablas principales se encuentran:

users
analysis
audit_log
keywords
⚙️ Configuración del Backend

Ingresar a la carpeta:

cd backend

Instalar las dependencias:

npm install

Crear un archivo:

backend/.env

Agregar las variables de entorno:

PORT=3000
NODE_ENV=development


DB_HOST=localhost
DB_PORT=5432
DB_NAME=ClioUser
DB_USER=clio
DB_PASSWORD=CAMBIAR_ESTA_CONTRASEÑA


GEMINI_API_KEY=TU_API_KEY_DE_GEMINI
GEMINI_MODEL=gemini-3.5-flash


JWT_SECRET=CAMBIAR_POR_UN_SECRETO_SEGURO

No subir el archivo .env al repositorio.

Obtener la API Key de Gemini
Acceder a Google AI Studio.
Crear o seleccionar un proyecto.
Generar una API Key.
Copiar la clave.
Colocarla en:
GEMINI_API_KEY=TU_API_KEY
Ejecutar el Backend

Desde backend:

npm run dev

El backend estará disponible normalmente en:

http://localhost:3000
🎨 Configuración del Frontend

Abrir una nueva terminal.

Desde la raíz del proyecto:

cd frontend

Instalar dependencias:

npm install

Ejecutar el proyecto:

npm run dev

Vite mostrará una dirección similar a:

http://localhost:5173

Abrir esa dirección en el navegador.

Comandos principales
Backend
npm run dev

Ejecuta el servidor en modo desarrollo.

npm start

Ejecuta el servidor.

Frontend
npm run dev

Ejecuta Vite en modo desarrollo.

npm run build

Genera la versión de producción.

npm run preview

Permite visualizar el build de producción.

npm run lint

Ejecuta el análisis estático del código.

🛠️ Stack Tecnológico
Frontend
Tecnología	Propósito
React	Construcción de la interfaz
Vite	Herramienta de desarrollo y build
Tailwind CSS	Estilos de la aplicación
React Router	Manejo de rutas
Axios	Consumo de la API REST
Chart.js	Visualización de estadísticas
JavaScript	Lenguaje principal del frontend
Backend
Tecnología	Propósito
Node.js	Entorno de ejecución
Express.js	Framework para API REST
TypeORM	Acceso y persistencia de datos
PostgreSQL	Base de datos relacional
pg	Driver de PostgreSQL
bcryptjs	Hash de contraseñas
JSON Web Token	Autenticación
Google Gemini	Inteligencia artificial
dotenv	Gestión de variables de entorno
CORS	Control de solicitudes entre dominios
🏗️ Arquitectura del Sistema

Clio utiliza una arquitectura de aplicación web cliente-servidor.

┌──────────────────────────────┐
│       FRONTEND               │
│       React + Vite           │
│                              │
│       Puerto 5173            │
└──────────────┬───────────────┘
               │
               │ HTTP / REST
               │ Axios
               ▼
┌──────────────────────────────┐
│        BACKEND               │
│      Node.js + Express       │
│                              │
│       Puerto 3000            │
└──────────────┬───────────────┘
               │
        ┌──────┴──────────┐
        │                 │
        ▼                 ▼
┌───────────────┐   ┌───────────────┐
│  PostgreSQL   │   │ Google Gemini │
│   Database    │   │      API      │
└───────────────┘   └───────────────┘
📁 Estructura del Proyecto
Clio/
│       │   ├── analysisController.js
│       │   ├── auditController.js
│       │   ├── keywordController.js
│       │   ├── statisticsController.js
│       │   └── userController.js
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js
│       │   └── logger.middleware.js
│       │
│       ├── models/
│       │   ├── User.js
│       │   ├── Analysis.js
│       │   ├── AuditLog.js
│       │   └── Keyword.js
│       │
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── analysisRoutes.js
│       │   ├── auditRoutes.js
│       │   ├── keywordRoutes.js
│       │   ├── statisticsRoutes.js
│       │   └── userRoutes.js
│       │
│       ├── services/
│       │   └── geminiService.js
│       │
│       └── sql/
│           └── schema.sql
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   │
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       │
│       ├── common/
│       │   ├── Alert.jsx
│       │   ├── Button.jsx
│       │   ├── Card.jsx
│       │   ├── Loading.jsx
│       │   ├── Logo.jsx
│       │   └── TextField.jsx
│       │
│       ├── components/
│       │   ├── Header/
│       │   ├── Sidebar/
│       │   ├── Footer/
│       │   ├── AdminDashboard/
│       │   ├── AIInteractivePanel/
│       │   ├── AnalysisResults/
│       │   ├── AuditHistory/
│       │   └── ErrorBanner/
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── AnalysisPage.jsx
│       │   └── Auth/
│       │       ├── Login.jsx
│       │       └── Register.jsx
│       │
│       ├── routes/
│       │   ├── AppRoutes.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── AdminRoute.jsx
│       │   └── routePaths.js
│       │
│       ├── services/
│       │   ├── authService.js
│       │   ├── analysisService.js
│       │   ├── auditService.js
│       │   ├── statisticsService.js
│       │   ├── userService.js
│       │   └── authStorage.js
│       │
│       ├── constants/
│       │   ├── authConstants.js
│       │   ├── analysisConstants.js
│       │   ├── analysisPageConstants.js
│       │   ├── adminDashboardConstants.js
│       │   ├── homePageConstants.js
│       │   └── uiConstants.js
│       │
│       └── utils/
│           └── auditUtils.js
│
└── ADRs/
    ├── 1.Componentes-React.md
    ├── 2.Estilo-Codigo-JS.md
    ├── 3.Estructura-Carpetas.md
    ├── 4.Framework-Estilos.md
    ├── 5.Commits-Git.md
    └── 6.Idioma-Documentacion.md
🔌 API REST

La API utiliza como dirección base:

http://localhost:3000/api

Los endpoints protegidos requieren un token JWT:

Authorization: Bearer <token>
Autenticación
Registrar usuario
POST /api/auth/register

Ejemplo:

{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
Iniciar sesión
POST /api/auth/login

Ejemplo:

{
  "email": "juan@example.com",
  "password": "password123"
}
Análisis
Crear análisis
POST /api/analysis

Ejemplo:

{
  "originalText": "La Revolución Francesa comenzó en 1789."
}
Obtener análisis
GET /api/analysis
Actualizar análisis
PUT /api/analysis/:id
Eliminar análisis
DELETE /api/analysis/:id
Estadísticas
GET /api/statistics

Este endpoint permite obtener información estadística del sistema de acuerdo con los permisos del usuario.

Auditoría
GET /api/admin/audit

Este endpoint está destinado a usuarios autorizados y permite consultar el historial de operaciones registradas.

Usuarios
GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id

Los endpoints administrativos requieren autorización según el rol del usuario.

🗄️ Base de Datos

Clio utiliza PostgreSQL, una base de datos relacional.

La elección de PostgreSQL se debe a que el proyecto requiere:

Integridad referencial.
Claves primarias y foráneas.
Restricciones de integridad.
Relaciones entre usuarios y análisis.
Persistencia de información.
Auditoría.
Consultas y agregaciones.
Reportería.
Control de acceso.
Entidades principales
Users

Almacena la información de los usuarios:

Identificador.
Nombre.
Apellido.
Correo electrónico.
Contraseña.
Rol.
Analysis

Almacena los análisis realizados:

Identificador.
Usuario propietario.
Texto original.
Texto analizado.
Veredicto.
Explicación.
Términos clave.
Estado de eliminación.
Fecha de creación.
Audit Log

Almacena información relacionada con las operaciones realizadas sobre los datos.

Keywords

Almacena información relacionada con los términos clave utilizados en los análisis.

🔍 Auditoría y Trazabilidad

Clio implementa mecanismos de auditoría para mantener la trazabilidad de las operaciones importantes.

El sistema registra información como:

Usuario
Fecha
Operación
Registro afectado
Datos anteriores
Datos nuevos

Las operaciones auditadas incluyen:

INSERT
UPDATE
DELETE

La auditoría permite conocer qué usuario realizó una operación y qué cambios fueron efectuados.

🔐 Seguridad

Clio incorpora diferentes mecanismos de seguridad.

Autenticación

La autenticación utiliza:

JWT

Los usuarios deben autenticarse para acceder a funcionalidades protegidas.

Contraseñas

Las contraseñas no se almacenan directamente.

Se utiliza:

bcryptjs

para generar un hash seguro de las contraseñas.

Control de acceso

El sistema utiliza roles:

user
admin

Los usuarios administradores pueden acceder a funcionalidades restringidas como:

Estadísticas.
Auditoría.
Gestión administrativa.
Variables de entorno

Las credenciales y claves sensibles se almacenan mediante variables de entorno:

.env

El archivo .env no debe ser incluido en el repositorio.

CORS

El backend incorpora configuración de CORS para controlar las solicitudes provenientes del frontend.

👥 Roles y Permisos
Funcionalidad	Usuario	Administrador
Registrarse	✅	✅
Iniciar sesión	✅	✅
Analizar textos	✅	✅
Ver historial	✅	✅
Editar análisis	✅	✅
Eliminar análisis	✅	✅
Ver estadísticas globales	❌	✅
Consultar auditoría	❌	✅
Gestión administrativa	❌	✅
📊 Reportería y Estadísticas

El sistema contempla funcionalidades de reportería para proporcionar información útil sobre el uso de Clio.

Entre los indicadores considerados se encuentran:

Cantidad total de análisis.
Distribución de veredictos.
Análisis realizados por usuarios.
Información agregada del sistema.

Los datos estadísticos son procesados en el backend y presentados mediante componentes visuales en el frontend.

🔄 Flujo General del Sistema
Usuario
   │
   ▼
Inicio de sesión
   │
   ▼
Validación JWT
   │
   ▼
Panel principal
   │
   ▼
Ingresar texto histórico
   │
   ▼
Frontend
   │
   ▼
API REST
   │
   ▼
Backend Express
   │
   ├──────────────► Google Gemini
   │                     │
   │                     ▼
   │                Veredicto
   │                Explicación
   │                Keywords
   │
   ▼
PostgreSQL
   │
   ▼
Guardar análisis
   │
   ▼
Mostrar resultado
🧪 Pruebas Manuales Recomendadas

Después de instalar el proyecto se recomienda comprobar:

Autenticación
Registrar un usuario.
Intentar registrar un correo existente.
Iniciar sesión con credenciales correctas.
Intentar iniciar sesión con credenciales incorrectas.
Análisis
Analizar un texto válido.
Intentar analizar un texto vacío.
Comprobar el resultado de la IA.
Comprobar que el análisis se almacena.
Historial
Consultar análisis anteriores.
Editar un análisis.
Comprobar la actualización.
Eliminar un análisis.
Confirmar que deja de aparecer en el historial.
Administración
Ingresar con un usuario administrador.
Consultar estadísticas.
Consultar auditoría.
Intentar acceder a funcionalidades administrativas con un usuario estándar.
🌱 Flujo de Trabajo con Git

Para contribuir al proyecto se recomienda trabajar mediante ramas:

git checkout -b nombre-de-la-tarea

Realizar cambios:

git add .

Crear el commit:

git commit -m "feat: description of changes"

Subir la rama:

git push -u origin nombre-de-la-tarea

Posteriormente se crea un Pull Request para revisión del equipo.

📋 Buenas Prácticas

El proyecto sigue prácticas de desarrollo colaborativo:

Uso de ramas independientes.
Pull Requests.
Revisión de código.
Commits descriptivos.
Componentes reutilizables.
Separación de responsabilidades.
Variables y funciones con nombres claros.
Constantes centralizadas.
Validación de datos.
Manejo de errores.
Variables sensibles mediante .env.
Documentación técnica mediante README y ADRs.
📚 Documentación del Proyecto

La documentación complementaria se encuentra organizada en:

Confluence: documentación funcional y técnica.
Jira: gestión de historias, tareas y Sprint.
ADRs: decisiones arquitectónicas.
README: instalación, funcionamiento y tecnologías.
Documentación de base de datos: estructura, relaciones y reglas.
👨‍💻 Equipo
Equipo Clio
Doménica Faz Mayorga — Product Owner / Desarrollo
Benjamín Paredes — Desarrollo
Vinicio David Naranjo Cruz — Desarrollo

El equipo trabaja de manera colaborativa mediante Git, GitHub, Jira y ceremonias Scrum.

⚠️ Limitaciones

Clio utiliza inteligencia artificial para realizar la clasificación de los textos.

Por esta razón:

Los resultados pueden contener errores.
La IA puede interpretar incorrectamente determinados contextos históricos.
Una clasificación no garantiza que una afirmación sea verdadera o falsa de forma absoluta.
Se recomienda contrastar los resultados con fuentes históricas confiables.

Clio debe utilizarse como una herramienta de apoyo para la investigación y no como sustituto de fuentes académicas.

📄 Licencia

Este proyecto utiliza la licencia ISC.

📞 Soporte

Para reportar errores o solicitar mejoras:

Crear un Issue en el repositorio.
Describir el problema.
Indicar los pasos necesarios para reproducirlo.
Adjuntar capturas o mensajes de error cuando sea necesario.
🚀 Estado del Proyecto

Clio se encuentra en desarrollo como proyecto integrador de:

Bases de Datos II.
Desarrollo Web.
Proyectos de Software.