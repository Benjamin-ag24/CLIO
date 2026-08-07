# Clio - Validador de Hechos Históricos con IA

Aplicación web que utiliza inteligencia artificial (Gemini) para verificar la veracidad de información histórica.

---

## 🎯 ¿Qué hace Clio?

Clio te permite pegar un texto o afirmación histórica y recibir un análisis con:

- _Semáforo de veracidad:_ Verde (veraz), Amarillo (dudoso), Rojo (falso).
- _Explicación detallada:_ Entiende por qué se llegó a esa conclusión.
- _Términos clave:_ Palabras importantes detectadas en el análisis.

---

## 🚀 ¿Cómo usar Clio?

1. Escribe o pega un texto histórico en el área de entrada.
2. Haz clic en _"Validar hecho"_.
3. Espera unos segundos mientras la IA analiza el contenido.
4. Revisa el reporte con el semáforo y la explicación.

_Ejemplo:_

> "Antes de la década de 1440, la inmensa mayoría de los textos se copiaban a mano, un proceso sumamente lento y costoso realizado principalmente por monjes en monasterios. Esta barrera significaba que el saber estaba restringido a las élites y que los índices de alfabetización eran extremadamente bajos. En Europa, el monopolio de la información residía casi en su totalidad en la Iglesia"

Puedes utilizar _"Limpiar"_ para borrar el texto y comenzar de nuevo. Después de un análisis, _"Nuevo análisis"_ devuelve la aplicación al estado inicial. Si ocurre un error de comunicación, utiliza _"Intentar de nuevo"_ para repetir el análisis sin volver a escribir el contenido.

---

## ⚙️ Requisitos técnicos

- Node.js (v18 o superior).
- npm.
- API Key de Google Gemini (gratuita).

---

## 📦 Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Clio
```

### 2. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 3. Configurar la API Key de Gemini

Crea o edita el archivo `backend/.env` con la siguiente configuración:

```env
PORT=3000
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-3.5-flash
```

Reemplaza `tu_api_key_de_gemini` por tu clave real. No compartas este archivo ni subas la clave a un repositorio público.

### 4. Iniciar el backend

Desde la carpeta `backend`, ejecuta:

```bash
npm run dev
```

El servidor quedará disponible en:

```text
http://localhost:3000
```

### 5. Instalar dependencias del frontend

Abre otra terminal en la raíz del proyecto y ejecuta:

```bash
cd frontend
npm install
```

### 6. Iniciar el frontend

Desde la carpeta `frontend`, ejecuta:

```bash
npm run dev
```

Vite mostrará en la terminal la URL local de la aplicación, normalmente:

```text
http://localhost:5173
```

Abre esa dirección en el navegador con el backend ejecutándose en paralelo.

---

El endpoint utilizado por el frontend es:

```text
POST http://localhost:3000/api/analisar
```

Recibe un cuerpo JSON con este formato:

```json
{
  "texto": "Antes de la década de 1440, la inmensa mayoría de los textos se copiaban a mano, un proceso sumamente lento y costoso realizado principalmente por monjes en monasterios. Esta barrera significaba que el saber estaba restringido a las élites y que los índices de alfabetización eran extremadamente bajos. En Europa, el monopolio de la información residía casi en su totalidad en la Iglesia"
}
```

---

## 🗂️ Estructura principal

```text
Clio/
├── backend/
│   ├── .env
│   ├── package.json
│   └── src/
│       └── server.js
├── frontend/
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

---

## 🔒 Seguridad

- Mantén `GEMINI_API_KEY` únicamente en el archivo `.env` del backend.
- No incluyas claves, tokens ni credenciales en el código fuente.
- No compartas capturas de pantalla o registros que contengan la API Key.
- Si una clave se expone accidentalmente, revócala y genera una nueva desde Google AI Studio.

---

## ℹ️ Notas

Clio ofrece una clasificación asistida por IA y debe utilizarse como apoyo para la investigación. Para decisiones académicas o profesionales, comprueba las afirmaciones consultando fuentes históricas confiables.
