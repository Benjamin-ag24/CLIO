// backend/src/authMiddleware.js
import jwt from "jsonwebtoken";

export function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Acceso denegado. Token no proporcionado.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({
      error: "Token inválido o expirado.",
    });
  }
}

// NUEVO: verifica que el usuario tenga el rol requerido
export function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.rol !== requiredRole) {
      return res.status(403).json({
        error: "No tienes permisos para acceder a este recurso.",
      });
    }
    next();
  };
}
