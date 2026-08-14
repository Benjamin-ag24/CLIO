# Clio - Validador de Hechos Históricos con IA

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.2+-blue)](https://expressjs.com)
[![React](https://img.shields.io/badge/React-19.2+-blue)](https://react.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-ISC-green)]()

Aplicación web full-stack que utiliza inteligencia artificial (Google Gemini) para verificar la veracidad de información histórica de manera rápida y precisa.

[Características](#-características) • [Instalación](#-instalación-completa) • [Uso](#-manual-de-usuario) • [Tecnologías](#-stack-tecnológico) • [API](#-documentación-de-api)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características](#-características)
- [Manual de Usuario](#-manual-de-usuario)
- [Instalación Completa](#-instalación-completa)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación de API](#-documentación-de-api)
- [Seguridad](#-seguridad)
- [Equipo](#-equipo)
- [Licencia](#-licencia)

---

## 🎯 Descripción General

**Clio** es una herramienta educativa diseñada para ayudarte a verificar la veracidad de afirmaciones históricas. Utilizando la potencia de Google Gemini AI, analiza textos históricos y proporciona:

- ✅ **Clasificación de veracidad** con semáforo visual (Verde/Amarillo/Rojo)
- 📖 **Explicaciones detalladas** sobre el análisis realizado
- 🔑 **Extracción de términos clave** relacionados con el texto
- 📊 **Historial de análisis** para usuarios registrados
- 🛡️ **Auditoría completa** de operaciones en el sistema
- 👨‍💼 **Dashboard administrativo** para gestión del sistema

---

## ✨ Características

### Para Usuarios Estándar
- 🔐 Autenticación segura con JWT
- 📝 Análisis ilimitado de hechos históricos
- 💾 Historial persistente de análisis realizados
- 🔍 Búsqueda y filtrado de análisis anteriores
- 📊 Visualización de gráficos de análisis
- 🗑️ Gestión de análisis (crear, ver, eliminar)

### Para Administradores
- 👥 Gestión de usuarios (crear, editar, eliminar, cambiar roles)
- 📊 Estadísticas globales del sistema
- 🔍 Auditoría de operaciones y cambios
- ⚙️ Monitoreo de la aplicación
- 📈 Reportes de uso del sistema

---

## 📘 Manual de Usuario

### Inicio de Sesión

1. **Accede a la aplicación** en `http://localhost:5173`
2. **Regístrate** si es la primera vez:
   - Completa el formulario con nombre, apellido, email y contraseña
   - Haz clic en "Registrarse"
3. **Inicia sesión** con tus credenciales

### Validar un Hecho Histórico

#### Paso 1: Acceder a la herramienta
- Una vez autenticado, verás la página principal con un área de entrada de texto

#### Paso 2: Ingresar el texto
- Escribe o pega el hecho histórico que deseas validar
- La aplicación acepta textos de cualquier longitud
- Ejemplo de entrada:
  ```
  "La Revolución Francesa comenzó en 1789 con la toma de la Bastilla."
  ```

#### Paso 3: Iniciar el análisis
- Haz clic en el botón **"Validar hecho"**
- Espera a que la IA procese el contenido (generalmente 2-5 segundos)

#### Paso 4: Revisar los resultados

El análisis mostrará:

**Semáforo de Veracidad:**
- 🟢 **Verde (Veraz)**: La afirmación es históricamente correcta
- 🟡 **Amarillo (Dudoso)**: La afirmación tiene elementos cuestionables o es incompleta
- 🔴 **Rojo (Falso)**: La afirmación contradice hechos históricos comprobados

**Explicación Detallada:**
- Análisis profundo sobre por qué se llegó a esa conclusión
- Referencias a contexto histórico
- Aclaraciones sobre puntos débiles o errores

**Términos Clave:**
- Palabras y conceptos importantes identificados en el análisis
- Útiles para investigación adicional

#### Paso 5: Acciones después del análisis

- **Limpiar**: Borra el texto para validar uno nuevo
- **Nuevo análisis**: Devuelve la aplicación al estado inicial
- **Intentar de nuevo**: Repite el análisis si hubo error de comunicación

### Gestionar tu Historial

1. **Ver análisis anteriores**:
   - Accede a la sección "Historial de análisis"
   - Ver lista de todos tus análisis con fecha y veredicto

2. **Buscar análisis**:
   - Utiliza el filtro por palabras clave o rango de fechas
   - Filtra por tipo de veredicto (Veraz, Dudoso, Falso)

3. **Eliminar análisis**:
   - Selecciona un análisis de tu historial
   - Haz clic en eliminar
   - Confirma la acción

### Características de Administrador

Si tienes rol de administrador, accede a:

- **Dashboard**: Resumen de estadísticas del sistema
- **Gestión de usuarios**: Ver, editar o eliminar usuarios
- **Auditoría**: Registro de todas las operaciones realizadas
- **Reportes**: Gráficos y análisis de uso del sistema

### Tips y Mejores Prácticas

✅ **Hazlo bien:**
- Utiliza Clio para complementar tu investigación histórica
- Consulta varias fuentes confiables para verificar conclusiones
- Lee la explicación completa del análisis
- Guarda análisis importante para futuras referencias

❌ **Evita:**
- Usar Clio como única fuente de verdad histórica
- Validar información muy reciente sin contrastar con académicos
- Confiar ciegamente en la IA sin investigación adicional

---

## 🔧 Instalación Completa

### Requisitos Previos

Asegúrate de tener instalado:

| Herramienta | Versión | Descargar |
|-------------|---------|-----------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| npm | v9+ | Incluido con Node.js |
| PostgreSQL | 12+ | [postgresql.org](https://www.postgresql.org/download) |
| Git | Último | [git-scm.com](https://git-scm.com) |

Verificar instalación:
```bash
node --version    # v18.x.x o superior
npm --version     # v9.x.x o superior
psql --version    # psql (PostgreSQL) 12+ o superior
```

### Paso 1: Clonar el Repositorio

```bash
git clone <url-del-repositorio>
cd Clio
```

### Paso 2: Configurar PostgreSQL

#### 2.1 Crear la base de datos

```bash
# Abre psql (línea de comandos de PostgreSQL)
psql -U postgres

# En la línea de comandos de psql:
CREATE DATABASE "ClioUser" ENCODING 'UTF8' LC_COLLATE 'es_ES.UTF-8' LC_CTYPE 'es_ES.UTF-8';
CREATE USER clio WITH PASSWORD 'clio2026admin';
ALTER ROLE clio SET client_encoding TO 'utf8';
ALTER ROLE clio SET default_transaction_isolation TO 'read committed';
ALTER ROLE clio SET default_transaction_deferrable TO on;
ALTER ROLE clio SET timezone TO 'America/Bogota';
GRANT ALL PRIVILEGES ON DATABASE "ClioUser" TO clio;
\c ClioUser
GRANT ALL ON SCHEMA public TO clio;
```

#### 2.2 Cargar el esquema de la base de datos

```bash
# Desde la raíz del proyecto
psql -U clio -d ClioUser -f backend/src/sql/schema.sql
```

Verifica que las tablas se crearon correctamente:
```bash
psql -U clio -d ClioUser -c "\dt"
```

Deberías ver:
- `users` - Información de usuarios
- `analysis` - Análisis realizados
- `audit_log` - Registro de auditoría
- `keywords` - Palabras clave extraídas

### Paso 3: Configurar el Backend

#### 3.1 Instalar dependencias

```bash
cd backend
npm install
```

#### 3.2 Crear archivo `.env`

Crea o edita `backend/.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ClioUser
DB_USER=clio
DB_PASSWORD=clio2026admin

# Google Gemini API
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-3.5-flash

# JWT Secret (cambiar en producción)
JWT_SECRET=clio_super_secreto_2026_cambiar_en_produccion
```

**Obtener API Key de Gemini:**
1. Ve a [Google AI Studio](https://aistudio.google.com)
2. Haz clic en "Get API Key"
3. Crea una nueva clave o usa una existente
4. Cópiala en el archivo `.env`

#### 3.3 Iniciar el backend

```bash
npm run dev
```

Verifica que se inicia correctamente:
```text
✓ Servidor ejecutándose en puerto 3000
✓ Conectado a PostgreSQL
```

El backend estará disponible en: `http://localhost:3000`

**Comandos disponibles:**
```bash
npm run dev      # Desarrollo con auto-reload
npm start        # Producción
npm test         # Tests (no configurados aún)
```

### Paso 4: Configurar el Frontend

#### 4.1 Instalar dependencias

Abre una nueva terminal en la raíz del proyecto:

```bash
cd frontend
npm install
```

#### 4.2 Iniciar el frontend

```bash
npm run dev
```

Vite mostrará en la terminal la URL local:

```text
Local:   http://localhost:5173
```

Abre esa dirección en tu navegador preferido.

**Comandos disponibles:**
```bash
npm run dev      # Desarrollo con hot reload
npm run build    # Compilar para producción
npm run preview  # Vista previa de build
npm run lint     # Verificar código con oxlint
```

### Paso 5: Verificación Final

✅ **Backend ejecutándose:**
- Accede a `http://localhost:3000`
- Verifica conexión a base de datos

✅ **Frontend ejecutándose:**
- Accede a `http://localhost:5173`
- Deberías ver la página de login

✅ **Aplicación lista:**
- Regístrate con un usuario de prueba
- Prueba validando un hecho histórico

---

## 🛠️ Stack Tecnológico

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.7 | Librería UI principal |
| **Vite** | 8.1.1 | Build tool y dev server |
| **Tailwind CSS** | 3.4.19 | Estilos y componentes |
| **React Router** | 7.18.2 | Enrutamiento de páginas |
| **Axios** | 1.18.1 | Cliente HTTP |
| **Chart.js** | 4.5.1 | Gráficos y visualizaciones |
| **Oxlint** | 1.71.0 | Linter de código |

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **Express** | 5.2.1 | Framework web |
| **PostgreSQL** | 12+ | Base de datos relacional |
| **TypeORM** | 1.1.0 | ORM para Node.js |
| **pg** | 8.22.0 | Driver PostgreSQL nativo |
| **Google Gemini API** | @google/genai 2.13.0 | IA para análisis |
| **JWT** | jsonwebtoken 9.0.3 | Autenticación |
| **bcryptjs** | 3.0.3 | Hash de contraseñas |
| **CORS** | 2.8.6 | Manejo de CORS |
| **dotenv** | 17.4.2 | Gestión de variables de entorno |

### Stack Completo

```
┌─────────────────────────────────────┐
│         Frontend (React + Vite)      │
│        http://localhost:5173        │
└────────────────┬────────────────────┘
                 │ Axios HTTP
                 ▼
┌─────────────────────────────────────┐
│     Backend (Express.js + Node.js)   │
│        http://localhost:3000        │
└────────────────┬────────────────────┘
                 │
        ┌────────┴────────┬──────────┐
        ▼                 ▼          ▼
   PostgreSQL      Google Gemini   JWT
   Database           API        Auth
```

---

## 📁 Estructura del Proyecto

```
Clio/
│
├── 📄 README.md                          # Este archivo
├── .gitignore                            # Configuración git
│
├── backend/                              # ⚙️ API REST y lógica
│   ├── .env                              # Variables de entorno (no versionado)
│   ├── .gitignore                        # Ignora node_modules y .env
│   ├── package.json                      # Dependencias del backend
│   ├── package-lock.json                 # Lock file
│   │
│   └── src/
│       ├── server.js                     # Punto de entrada principal
│       │
│       ├── config/
│       │   ├── database.js               # Configuración de conexión DB
│       │   └── aiPrompt.js               # Prompts para Gemini AI
│       │
│       ├── controllers/
│       │   ├── authController.js         # Autenticación y registro
│       │   ├── analysisController.js     # Gestión de análisis
│       │   ├── keywordController.js      # Gestión de palabras clave
│       │   ├── statisticsController.js   # Estadísticas del sistema
│       │   ├── auditController.js        # Registro de auditoría
│       │   └── userController.js         # Gestión de usuarios
│       │
│       ├── middleware/
│       │   ├── authMiddleware.js         # Validación de JWT
│       │   └── logger.middleware.js      # Registro de peticiones
│       │
│       ├── models/
│       │   ├── User.js                   # Modelo de usuario
│       │   ├── Analysis.js               # Modelo de análisis
│       │   ├── AuditLog.js               # Modelo de auditoría
│       │   └── Keyword.js                # Modelo de palabras clave
│       │
│       ├── routes/
│       │   ├── authRoutes.js             # /api/auth (login, registro)
│       │   ├── analysisRoutes.js         # /api/analysis
│       │   ├── keywordRoutes.js          # /api/keywords
│       │   ├── statisticsRoutes.js       # /api/statistics
│       │   ├── auditRoutes.js            # /api/audit
│       │   └── userRoutes.js             # /api/users
│       │
│       ├── services/
│       │   └── geminiService.js          # Integración con Gemini API
│       │
│       └── sql/
│           └── schema.sql                # Definición de base de datos
│
├── frontend/                             # 🎨 Interfaz de usuario
│   ├── .gitignore                        # Ignora node_modules y build
│   ├── .oxlintrc.json                    # Configuración de oxlint
│   ├── package.json                      # Dependencias del frontend
│   ├── package-lock.json                 # Lock file
│   ├── vite.config.js                    # Configuración de Vite
│   ├── tailwind.config.js                # Configuración de Tailwind
│   ├── postcss.config.js                 # Configuración de PostCSS
│   ├── index.html                        # Punto de entrada HTML
│   │
│   └── src/
│       ├── main.jsx                      # Punto de entrada React
│       ├── App.jsx                       # Componente raíz
│       ├── index.css                     # Estilos globales
│       │
│       ├── common/                       # 🧩 Componentes reutilizables
│       │   ├── Alert.jsx & .styles.js
│       │   ├── Button.jsx & .styles.js
│       │   ├── Card.jsx & .styles.js
│       │   ├── Loading.jsx & .styles.js
│       │   ├── Logo.jsx & .styles.js
│       │   └── TextField.jsx & .styles.js
│       │
│       ├── components/                   # 🎯 Componentes específicos
│       │   ├── Header/                   # Barra de navegación
│       │   ├── Sidebar/                  # Panel lateral
│       │   ├── Footer/                   # Pie de página
│       │   ├── AdminDashboard/           # Dashboard de admin
│       │   │   └── AdminDashboard.jsx
│       │   ├── AIInteractivePanel/       # Panel de análisis
│       │   │   └── AIInteractivePanel.jsx
│       │   ├── AnalysisResults/          # Resultados del análisis
│       │   │   ├── ReportPanel/
│       │   │   └── Semaphore/
│       │   ├── AuditHistory/             # Historial de auditoría
│       │   ├── ErrorBanner/              # Banner de errores
│       │   └── ...más componentes
│       │
│       ├── pages/                        # 📄 Páginas principales
│       │   ├── Home.jsx & .styles.js
│       │   ├── AnalysisPage.jsx & .styles.js
│       │   └── Auth/                     # Autenticación
│       │       ├── Login.jsx
│       │       └── Register.jsx
│       │
│       ├── routes/                       # 🛣️ Configuración de rutas
│       │   ├── AppRoutes.jsx             # Rutas principales
│       │   ├── ProtectedRoute.jsx        # Rutas protegidas
│       │   ├── AdminRoute.jsx            # Rutas de admin
│       │   └── routePaths.js             # Constantes de rutas
│       │
│       ├── services/                     # 🔌 Servicios API
│       │   ├── authService.js            # Autenticación
│       │   ├── analysisService.js        # Análisis
│       │   ├── auditService.js           # Auditoría
│       │   ├── statisticsService.js      # Estadísticas
│       │   ├── userService.js            # Usuarios
│       │   └── authStorage.js            # Almacenamiento local
│       │
│       ├── constants/                    # ⚙️ Constantes
│       │   ├── authConstants.js
│       │   ├── analysisConstants.js
│       │   ├── analysisPageConstants.js
│       │   ├── adminDashboardConstants.js
│       │   ├── homePageConstants.js
│       │   ├── configConstants.js
│       │   └── uiConstants.js
│       │
│       ├── utils/                        # 🛠️ Funciones auxiliares
│       │   └── auditUtils.js
│       │
│       ├── assets/                       # 📷 Imágenes y recursos
│       └── public/                       # 📁 Archivos públicos
│
└── ADRs/                                 # 📋 Decisiones arquitectónicas
    ├── 1.Componentes-React.md
    ├── 2.Estilo-Codigo-JS.md
    ├── 3.Estructura-Carpetas.md
    ├── 4.Framework-Estilos.md
    ├── 5.Commits-Git.md
    └── 6.Idioma-Documentacion.md
```

---

## 🔌 Documentación de API

### Base URL
```
http://localhost:3000/api
```

### Autenticación
La mayoría de endpoints requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

### Endpoints Principales

#### Análisis
```
POST /api/analisar
Content-Type: application/json
Body: {
  "texto": "string - Texto a analizar"
}

Response (200):
{
  "veredicto": "veraz|dudoso|falso",
  "explicacion": "string - Análisis detallado",
  "palabrasClave": ["string"],
  "timestamp": "ISO-8601"
}
```

#### Autenticación
```
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password"
}

POST /api/auth/register
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "password"
}
```

#### Usuarios (Admin)
```
GET /api/users           # Listar usuarios
POST /api/users          # Crear usuario
PUT /api/users/:id       # Actualizar usuario
DELETE /api/users/:id    # Eliminar usuario
```

#### Estadísticas
```
GET /api/statistics     # Obtener estadísticas globales
```

#### Auditoría
```
GET /api/audit          # Obtener registro de auditoría
```

---

## 🔒 Seguridad

### Mejores Prácticas Implementadas

✅ **Autenticación y Autorización**
- Contraseñas hasheadas con bcryptjs
- JWT para sesiones seguras
- Roles de usuario (user, admin)
- Refresh tokens para seguridad extendida

✅ **Protección de Datos**
- CORS configurado correctamente
- Variables sensibles en `.env` (no versionado)
- SQL injection prevention con ORM TypeORM
- Input validation en todos los endpoints

✅ **Auditoría y Monitoreo**
- Registro completo de operaciones en `audit_log`
- Timestamps en todas las operaciones
- Tracking de cambios en datos

### Checklist de Seguridad

**Antes de Producción:**

```bash
# 1. Cambiar JWT_SECRET
JWT_SECRET=<genera-una-clave-segura>

# 2. Cambiar DB_PASSWORD
DB_PASSWORD=<contraseña-fuerte>

# 3. Usar HTTPS
NODE_ENV=production

# 4. Verificar CORS origins
CORS_ORIGINS=https://tu-dominio.com

# 5. Cambiar GEMINI_API_KEY
# Usa una clave dedicada para producción

# 6. Hacer backup de la base de datos
pg_dump -U clio -d ClioUser > backup.sql

# 7. Configurar logs
NODE_ENV=production

# 8. Monitorear auditoría
# Revisa regularmente audit_log
```

### Protecciones Implementadas

- ❌ No exponer API keys en client
- ❌ No guardar contraseñas en texto plano
- ❌ No hacer commits de `.env`
- ✅ Validar entrada de usuario
- ✅ Sanitizar output
- ✅ Usar HTTPS en producción
- ✅ Rate limiting en producción
- ✅ CORS restrictivo

---

## 👥 Equipo

Clio fue desarrollado como parte del **Dev Challenge** de [Nombre de la Organización].

### Colaboradores

- **Tu Nombre** - Full Stack Development
- **Otro Nombre** - Frontend/UI
- **Otro Nombre** - Backend/Database

### Créditos

- **Gemini API** by Google - IA para análisis
- **React** - Librería de UI
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **Tailwind CSS** - Estilos

---

## 📝 Licencia

Este proyecto está bajo la licencia **ISC**. Ver archivo LICENSE para más detalles.

---

## ❓ Preguntas Frecuentes

### ¿Necesito internet para usar Clio?
Sí, se requiere conexión a internet para acceder a Google Gemini API.

### ¿Puedo usar esto comercialmente?
Sí, bajo la licencia ISC, pero verifica los términos de Google Gemini API.

### ¿Dónde reporto bugs?
Abre un issue en el repositorio con descripción detallada y pasos para reproducir.

### ¿Cómo contribuir?
1. Fork el repositorio
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push y abre un Pull Request

---

## 📞 Soporte y Contacto

- 📧 Email: [tu-email@example.com](mailto:tu-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/tu-usuario/Clio/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/tu-usuario/Clio/discussions)

---

## ℹ️ Notas Importantes

Clio ofrece una clasificación asistida por IA y debe utilizarse como **apoyo para la investigación histórica**. Para decisiones académicas o profesionales, siempre comprueba las afirmaciones consultando múltiples fuentes históricas confiables. No consideres el análisis de Clio como la verdad absoluta, sino como un punto de partida para investigación más profunda.

---

<div align="center">

**Hecho con ❤️ para la comunidad educativa**

[⬆ Volver al inicio](#clio---validador-de-hechos-históricos-con-ia)

</div>
