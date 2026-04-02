import notificationService from "../services/notificationService.js";

const notificationController = {

  getNotifications: async (req, res) => {

    try {

      const notifications =
        await notificationService.getNotifications();

      res.json(notifications);

    } catch (error) {

      console.error(error);

      res.status(500).json({
        message: "Failed to get notifications"
      });

    }

  }

};

export default notificationController;