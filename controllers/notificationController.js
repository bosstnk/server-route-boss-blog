import notificationService from "../services/notificationService.js";

const notificationController = {

  getNotifications: async (req, res) => {
    const userId = req.user.id;
    console.log("📝 [NOTIFICATION][GET][REQUEST]", { userId });

    try {
      const notifications = await notificationService.getNotifications(userId);

      console.log("✅ [NOTIFICATION][GET][RESPONSE]", { count: notifications.length });

      return res.json(notifications);
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [NOTIFICATION][GET][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [NOTIFICATION][GET][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  markAllAsRead: async (req, res) => {
    const userId = req.user.id;
    console.log("📝 [NOTIFICATION][MARK_ALL_READ][REQUEST]", { userId });

    try {
      await notificationService.markAllAsRead(userId);

      console.log("✅ [NOTIFICATION][MARK_ALL_READ][RESPONSE]");

      return res.json({ message: "All notifications marked as read" });
    } catch (error) {
      if (error.statusCode) {
        console.warn("⚠️ [NOTIFICATION][MARK_ALL_READ][BUSINESS]", {
          message: error.message,
          errors: error.errors,
        });
        const body = { message: error.message };
        if (error.errors) body.errors = error.errors;
        return res.status(error.statusCode).json(body);
      }
      console.error("💥 [NOTIFICATION][MARK_ALL_READ][SYSTEM]", { message: error.message });
      return res.status(500).json({ message: "Internal server error" });
    }
  },

};

export default notificationController;
