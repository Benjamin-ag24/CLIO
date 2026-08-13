import { AppDataSource } from "../config/database.js";

const getUserRepository = () => {
  return AppDataSource.getRepository("User");
};

// GET /api/admin/users
export const getUsers = async (req, res) => {
  try {
    const userRepository = getUserRepository();

    const users = await userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);

    return res.status(500).json({
      error: "Unable to load users.",
    });
  }
};

// PUT /api/admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const userRepository = getUserRepository();

    const userId = Number(req.params.id);

    const {
      firstName,
      lastName,
      email,
      role,
      isActive,
    } = req.body;

    const actingUserId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID.",
      });
    }

    if (
      !Number.isInteger(actingUserId) ||
      actingUserId <= 0
    ) {
      return res.status(401).json({
        error: "User is not authenticated.",
      });
    }

    const user = await userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    if (
      role !== undefined &&
      !["user", "admin"].includes(role)
    ) {
      return res.status(400).json({
        error: "Invalid role.",
      });
    }

    const updatedUser =
      await AppDataSource.transaction(async (manager) => {
        await manager.query(
          "SELECT set_config('app.current_user_id', $1, true)",
          [String(actingUserId)],
        );

        const transactionUserRepository =
          manager.getRepository("User");

        if (firstName !== undefined) {
          user.firstName = firstName;
        }

        if (lastName !== undefined) {
          user.lastName = lastName;
        }

        if (email !== undefined) {
          user.email = email;
        }

        if (role !== undefined) {
          user.role = role;
        }

        if (isActive !== undefined) {
          user.isActive = Boolean(isActive);
        }

        return await transactionUserRepository.save(user);
      });

    return res.status(200).json({
      message: "User updated successfully.",
      user: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        isActive: updatedUser.isActive,
      },
    });
  } catch (error) {
    console.error(
      "Error updating user:",
      error,
    );

    return res.status(500).json({
      error: "Unable to update the user.",
    });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const userRepository = getUserRepository();

    const userId = Number(req.params.id);

    const actingUserId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(400).json({
        error: "Invalid user ID.",
      });
    }

    if (
      !Number.isInteger(actingUserId) ||
      actingUserId <= 0
    ) {
      return res.status(401).json({
        error: "User is not authenticated.",
      });
    }

    const user = await userRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    await AppDataSource.transaction(
      async (manager) => {
        await manager.query(
          "SELECT set_config('app.current_user_id', $1, true)",
          [String(actingUserId)],
        );

        const transactionUserRepository =
          manager.getRepository("User");

        await transactionUserRepository.remove(user);
      },
    );

    return res.status(200).json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Error deleting user:",
      error,
    );

    return res.status(500).json({
      error: "Unable to delete the user.",
    });
  }
};