# Clio - Validador de Hechos Históricos con IA

Clio es una aplicación web full-stack que utiliza Google Gemini para analizar afirmaciones históricas y clasificarlas como Veraz, Dudoso o Falso, proporcionando una explicación y términos clave.

## 1.Tecnologías y versiones
Backend
•	Node.js: 18 o superior
•	Express.js: 5.x
•	TypeORM: 0.3.x
•	PostgreSQL: 12 o superior
•	pg: driver de PostgreSQL
•	bcryptjs: hash de contraseñas
•	jsonwebtoken: autenticación JWT
•	dotenv: variables de entorno
•	cors: configuración CORS
•	Google Gemini: análisis mediante IA
Frontend
•	React: 18+
•	Vite: 6+
•	Tailwind CSS: 3+
•	React Router: 7+
•	Axios: consumo de API REST
•	Chart.js: estadísticas

## 2.Requisitos previos

Antes de ejecutar Clio se necesita instalar:
•	Node.js 18 o superior
•	npm 9 o superior
•	PostgreSQL 12 o superior
•	Git
Verificar las versiones:
node --version
npm --version
psql --version
git --version

## 3.Instalación

1. Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>

cd Clio


2. Configurar la base de datos
Crear la base de datos en PostgreSQL:
CREATE DATABASE ClioUser;
Ejecutar el esquema:
psql -U postgres -d ClioUser -f backend/src/sql/schema.sql

3. Configurar el Backend
Entrar a la carpeta:

cd backend
Instalar dependencias:
npm install
Crear el archivo:
backend/.env
Agregar:
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

Ejecutar:
npm run dev
Backend:
http://localhost:3000

4. Configurar el Frontend
Abrir otra terminal y ejecutar:
cd frontend
npm install
npm run dev
Frontend:
http://localhost:5173

Abrir esa dirección en el navegador.

## 4.Ejecutar el proyecto

Se necesitan dos terminales.

Terminal 1 - Backend
cd backend
npm run dev

Terminal 2 - Frontend
cd frontend
npm run dev

Finalmente abrir:
http://localhost:5173

Abrir esa dirección en el navegador.
