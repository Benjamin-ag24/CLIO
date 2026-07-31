// frontend/src/services/authService.js
const API_URL = "http://localhost:3000/api/login";

export const login = async (username, password) => {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      throw { mensaje: datos.error || "Credenciales inválidas" };
    }

    localStorage.setItem("clio_token", datos.token);
    return datos.token;
  } catch (error) {
    throw { mensaje: error.mensaje || "No fue posible iniciar sesión" };
  }
};

export const logout = () => {
  localStorage.removeItem("clio_token");
};

export const getToken = () => localStorage.getItem("clio_token");