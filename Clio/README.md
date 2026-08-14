# Clio - Validador de Hechos Históricos con IA

Clio es una aplicación web **full-stack** que utiliza **Google Gemini** para analizar afirmaciones históricas y clasificarlas como **Veraz, Dudoso o Falso**, proporcionando una explicación y términos clave relacionados con el análisis.

---

## 📌 Tecnologías y versiones

### Backend

| Tecnología    | Versión / Uso              |
| ------------- | -------------------------- |
| Node.js       | 18 o superior              |
| Express.js    | 5.x                        |
| TypeORM       | 0.3.x                      |
| PostgreSQL    | 12 o superior              |
| pg            | Driver de PostgreSQL       |
| bcryptjs      | Hash de contraseñas        |
| jsonwebtoken  | Autenticación mediante JWT |
| dotenv        | Variables de entorno       |
| cors          | Configuración CORS         |
| Google Gemini | Análisis mediante IA       |

### Frontend

| Tecnología   | Versión / Uso           |
| ------------ | ----------------------- |
| React        | 18+                     |
| Vite         | 6+                      |
| Tailwind CSS | 3+                      |
| React Router | 7+                      |
| Axios        | Consumo de API REST     |
| Chart.js     | Estadísticas y gráficos |

---

## 📁 Estructura del proyecto

La estructura principal del proyecto es:

```text
Clio/
├── backend/
├── frontend/
└── README.md
```

### 📂 backend/

Contiene la lógica del servidor y los servicios necesarios para el funcionamiento de Clio, incluyendo:

* API REST
* Autenticación
* Controladores
* Rutas
* TypeORM
* Conexión con PostgreSQL
* Integración con Google Gemini
* Gestión de análisis
* Sistema de auditoría

### 📂 frontend/

Contiene la interfaz gráfica de Clio desarrollada con React, Vite y Tailwind CSS, incluyendo:

* Páginas
* Componentes
* Servicios
* Autenticación
* Historial de análisis
* Panel de análisis
* Estadísticas
* Consumo de la API REST
---

## ⚙️ Requisitos previos

Antes de ejecutar Clio es necesario tener instalados:

* Node.js 18 o superior
* npm 9 o superior
* PostgreSQL 12 o superior
* Git

### Verificar las versiones

```bash
node --version
npm --version
psql --version
git --version
```

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd Clio
```

---

### 2. Configurar la base de datos

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE ClioUser;
```

Después, ejecutar el esquema de la base de datos:

```bash
psql -U postgres -d ClioUser -f backend/src/sql/schema.sql
```

---

### 3. Configurar el Backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo:

```text
backend/.env
```

Agregar las siguientes variables de entorno:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=ClioUser
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA

GEMINI_API_KEY=TU_API_KEY
GEMINI_MODEL=gemini-3.5-flash

JWT_SECRET=TU_SECRETO
```

Iniciar el servidor:

```bash
npm run dev
```

El backend estará disponible en:

```text
http://localhost:3000
```

---

### 4. Configurar el Frontend

Abrir una **segunda terminal**.

Desde la carpeta principal del proyecto, entrar a `frontend`:

```bash
cd frontend
```

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

Abrir esta dirección en el navegador para acceder a Clio.

---

## ▶️ Ejecución del proyecto

Para ejecutar Clio se necesitan **dos terminales abiertas simultáneamente**.

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Servidor:

```text
http://localhost:3000
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Aplicación:

```text
http://localhost:5173
```

Finalmente, abrir en el navegador:

```text
http://localhost:5173
```

---

## 🔐 Variables de entorno

Las variables de entorno contienen información necesaria para conectar Clio con PostgreSQL, autenticar usuarios y utilizar Google Gemini.

El archivo `.env` **no debe subirse al repositorio**, ya que contiene información sensible como:

* Contraseña de PostgreSQL
* API Key de Google Gemini
* Secret utilizado para JWT

Cada desarrollador debe utilizar su propio archivo `.env` de forma local.

---
---

## 🧠 Análisis mediante IA

Clio utiliza **Google Gemini** para procesar las afirmaciones históricas introducidas por los usuarios.

El sistema genera:

* **Veredicto:** Veraz, Dudoso o Falso.
* **Explicación:** Justificación del resultado obtenido.
* **Términos clave:** Palabras o conceptos importantes relacionados con la afirmación.

---

## 🔒 Autenticación y seguridad

Clio utiliza diferentes mecanismos para proteger la aplicación:

* Autenticación mediante **JWT**.
* Contraseñas protegidas mediante **bcryptjs**.
* Variables sensibles almacenadas mediante `.env`.
* Control de acceso mediante roles.
* Protección de rutas privadas.
* Registro de operaciones mediante auditoría.

---

## 📊 Auditoría y trazabilidad

El sistema cuenta con un mecanismo de auditoría que permite registrar operaciones realizadas sobre los análisis.

La información registrada puede incluir:

* Usuario que realizó la operación.
* Fecha y hora.
* Tipo de operación.
* Datos anteriores.
* Datos nuevos.

El acceso al historial de auditoría está restringido a usuarios con permisos administrativos.

---

## 👥 Equipo

**Clio — Validador de Hechos Históricos con Inteligencia Artificial**

Proyecto desarrollado como una aplicación **full-stack**, integrando:

* Frontend
* Backend
* Base de datos
* Autenticación
* Inteligencia artificial
* Auditoría
* Estadísticas
