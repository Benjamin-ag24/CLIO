import { BACKEND_URL } from "./configConstants";
export const authCopy = {
  login: {
    title: "Iniciar sesión",
    description: "Ingresa tus credenciales para verificar hechos históricos.",
    fields: {
      email: "Correo electrónico",
      password: "Contraseña",
    },
    placeholders: {
      email: "tucorreo@ejemplo.com",
      password: "••••••••",
    },
    buttons: {
      submit: "Ingresar",
      loading: "Ingresando...",
    },
    footer: {
      noAccount: "¿No tienes cuenta?",
      action: "Regístrate",
    },
  },
  register: {
    title: "Crear cuenta",
    description: "Regístrate para empezar a verificar hechos históricos.",
    fields: {
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo electrónico",
      password: "Contraseña",
    },
    placeholders: {
      email: "tucorreo@ejemplo.com",
      password: "Mínimo 6 caracteres",
    },
    buttons: {
      submit: "Crear cuenta",
      loading: "Creando cuenta...",
    },
    footer: {
      hasAccount: "¿Ya tienes cuenta?",
      action: "Inicia sesión",
    },
    success: "¡Cuenta creada! Redirigiendo al inicio de sesión...",
  },
};

export const authValidationMessages = {
  requiredNames: "Nombre y apellido son obligatorios.",
  invalidEmail: "Ingresa un correo electrónico válido.",
  passwordLength: "La contraseña debe tener al menos 6 caracteres.",
  defaultLoginError: "Credenciales inválidas",
  defaultRegisterError: "No fue posible registrarte",
};

export const authApiEndpoints = {
  login: `${BACKEND_URL}/auth/login`,
  register: `${BACKEND_URL}/auth/register`,
};