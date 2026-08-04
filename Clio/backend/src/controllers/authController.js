// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { nombre, apellido, first_name, last_name, email, password } =
      req.body;

    const firstName = first_name ?? nombre;
    const lastName = last_name ?? apellido;

    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
    }

    const existente = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existente.rows.length > 0) {
      return res.status(400).json({ error: "Ese correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role)
       VALUES ($1, $2, $3, $4, 'user')
       RETURNING id, first_name, last_name, email, role`,
      [firstName, lastName, email, passwordHash],
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
      return res
        .status(400)
        .json({ error: "Correo y contraseña son obligatorios" });
    }

    const resultado = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
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
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        role: usuario.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" },
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.first_name,
        apellido: usuario.last_name,
        email: usuario.email,
        rol: usuario.role,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
