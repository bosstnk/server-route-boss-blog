import userService from "../services/userService.js";

const userController = {
  getUserById: async (req, res) => {
    const userId = req.user.id;

    console.log("👤 [USER][GET PROFILE] Start", { userId });

    try {
      const user = await userService.getUserById(userId);

      if (!user) {
        console.warn("⚠️ [USER][GET PROFILE] User not found", { userId });

        return res.status(404).json({
          message: "User not found",
        });
      }

      console.log("✅ [USER][GET PROFILE] Success", { userId });

      return res.json(user);
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [USER][GET PROFILE][BUSINESS]", {
          userId,
          message: error.message,
          errors: error.errors,
        });

        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }

      console.error("💥 [USER][GET PROFILE][SYSTEM]", {
        userId,
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  updateProfile: async (req, res) => {
    const userId = req.user.id;
    const { name, username, bio } = req.body;
    const file = req.files?.imageFile?.[0];

    console.log("📝 [USER][UPDATE PROFILE] Start", {
      userId,
      hasFile: !!file,
    });

    try {
      await userService.updateProfile(userId, {
        name,
        username,
        bio,
        file,
      });

      console.log("✅ [USER][UPDATE PROFILE] Success", { userId });

      return res.status(200).json({
        message: "Profile updated successfully",
      });
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [USER][UPDATE PROFILE][BUSINESS]", {
          userId,
          message: error.message,
          errors: error.errors,
        });

        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }

      console.error("💥 [USER][UPDATE PROFILE][SYSTEM]", {
        userId,
        message: error.message,
        hasFile: !!file,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },

  resetPassword: async (req, res) => {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    console.log("🔐 [USER][RESET PASSWORD] Start", { userId });

    try {
      await userService.resetPassword(userId, {
        currentPassword,
        newPassword,
      });

      console.log("✅ [USER][RESET PASSWORD] Success", { userId });

      return res.status(200).json({
        message: "Password updated successfully",
      });

    } catch (error) {

      if (error.statusCode) {
        console.warn("⚠️ [USER][RESET PASSWORD][BUSINESS]", {
          userId,
          message: error.message,
          errors: error.errors,
        });

        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }

      console.error("💥 [USER][RESET PASSWORD][SYSTEM]", {
        userId,
        message: error.message,
      });

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  },
};

export default userController;