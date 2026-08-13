// backend/src/controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database.js";

const userRepository = AppDataSource.getRepository("User");

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters long",
      });
    }

    const existingUser = await userRepository.findOneBy({
      email,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await AppDataSource.transaction(
      async (manager) => {
        const currentUserId = Number(
          req.user?.sub ?? req.user?.id
        );

        if (Number.isInteger(currentUserId) && currentUserId > 0) {
          await manager.query(
            "SET LOCAL app.current_user_id = $1",
            [currentUserId]
          );
        }

        const userRepo = manager.getRepository("User");

        const newUser = userRepo.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: "user",
        });

        return await userRepo.save(newUser);
      }
    );

    return res.status(201).json({
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("User registration failed:", error);

    return res.status(500).json({
      error: "User registration failed",
    });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const user = await userRepository.findOneBy({
      email,
    });

    if (!user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        error: "Incorrect password",
      });
    }

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("User login failed:", error);

    return res.status(500).json({
      error: "User login failed",
    });
  }
};