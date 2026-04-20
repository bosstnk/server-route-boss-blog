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
      console.error("💥 [NOTIFICATION][GET][SYSTEM]", error);
      return res.status(500).json({ message: "Failed to get notifications" });
    }
  },

};

export default notificationController;
