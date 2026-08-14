Clio - Validador de Hechos Históricos con IA

Clio es una aplicación web full-stack que utiliza Google Gemini para analizar afirmaciones históricas y clasificarlas como Veraz, Dudoso o Falso, proporcionando una explicación y términos clave relacionados con el análisis.

📌 Tecnologías y versiones

Backend
Tecnología	Versión / Uso
Node.js	18 o superior
Express.js	5.x
TypeORM	0.3.x
PostgreSQL	12 o superior
pg	Driver de PostgreSQL
bcryptjs	Hash de contraseñas
jsonwebtoken	Autenticación mediante JWT
dotenv	Variables de entorno
cors	Configuración CORS
Google Gemini	Análisis mediante IA
Frontend
Tecnología	Versión / Uso
React	18+
Vite	6+
Tailwind CSS	3+
React Router	7+
Axios	Consumo de API REST
Chart.js	Estadísticas y gráficos

📁 Estructura del proyecto

La estructura principal del proyecto está organizada de la siguiente manera:

Clio/
├── backend/
├── frontend/
└── README.md
backend/

Contiene toda la lógica del servidor, API REST, autenticación, conexión con PostgreSQL, integración con Google Gemini y gestión de datos mediante TypeORM.

frontend/

Contiene la interfaz gráfica de Clio desarrollada con React, Vite y Tailwind CSS. Aquí se encuentran las páginas, componentes, servicios para consumir la API y elementos visuales de la aplicación.

README.md

Documento principal con la información del proyecto, tecnologías utilizadas, requisitos e instrucciones necesarias para instalar y ejecutar Clio.

⚙️ Requisitos previos

Antes de ejecutar Clio es necesario tener instalados:

Node.js 18 o superior
npm 9 o superior
PostgreSQL 12 o superior
Git

Para verificar las versiones instaladas:

node --version
npm --version
psql --version
git --version

🚀 Instalación

1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd Clio
2. Configurar la base de datos

Crear la base de datos en PostgreSQL:

CREATE DATABASE ClioUser;

Después, ejecutar el esquema de la base de datos:

psql -U postgres -d ClioUser -f backend/src/sql/schema.sql
3. Configurar el Backend

Entrar a la carpeta del backend:

cd backend

Instalar las dependencias:

npm install

Crear el archivo .env dentro de la carpeta backend:

backend/.env

Agregar las siguientes variables:

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

Iniciar el servidor:

npm run dev

El backend estará disponible en:

http://localhost:3000

4. Configurar el Frontend

Abrir una segunda terminal y regresar a la carpeta principal del proyecto:

cd frontend

Instalar las dependencias:

npm install

Iniciar el servidor de desarrollo:

npm run dev

El frontend estará disponible en:

http://localhost:5173

Abrir esta dirección en el navegador para acceder a Clio.

▶️ Ejecución del proyecto

Para ejecutar Clio se necesitan dos terminales abiertas simultáneamente.

Terminal 1 — Backend

Desde la carpeta backend:

npm run dev

Servidor:

http://localhost:3000

Terminal 2 — Frontend

Desde la carpeta frontend:

npm run dev

Aplicación:

http://localhost:5173

Finalmente, abrir en el navegador:

http://localhost:5173

🔐 Variables de entorno

Las variables de entorno contienen información necesaria para conectar Clio con PostgreSQL, autenticar usuarios y utilizar Google Gemini.

El archivo .env no debe subirse al repositorio, ya que contiene información sensible como:

Contraseña de PostgreSQL
API Key de Google Gemini
Secret utilizado para JWT

Se debe utilizar un archivo .env local para cada entorno de desarrollo.

👥 Proyecto

Clio — Validador de Hechos Históricos con Inteligencia Artificial.

Aplicación desarrollada como proyecto full-stack, integrando frontend, backend, base de datos y servicios de inteligencia artificial.