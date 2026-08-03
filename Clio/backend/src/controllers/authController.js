// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    // Verificar que el email no exista ya
    const existente = await pool.query("SELECT id FROM usuarios WHERE email = $1", [email]);
    if (existente.rows.length > 0) {
      return res.status(400).json({ error: "Ese correo ya está registrado" });
    }

    // Hashear la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    // Guardar el usuario (rol siempre 'user' por defecto, nunca lo manda el cliente)
    const resultado = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password, rol)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, nombre, apellido, email, rol`,
      [nombre, apellido, email, passwordHash]
    );

    res.status(201).json({ usuario: resultado.rows[0] });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ error: "Error al registrar el usuario" });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const resultado = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};