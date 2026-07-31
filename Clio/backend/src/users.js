// backend/src/users.js
import bcrypt from "bcryptjs";

// Usuario de prueba: username "admin", password "clio123"
// (la contraseña está hasheada, nunca se guarda en texto plano)
export const users = [
  {
    id: 1,
    username: "admin",
    passwordHash: bcrypt.hashSync("clio123", 10),
  },
];

export const findUserByUsername = (username) =>
  users.find((u) => u.username === username);