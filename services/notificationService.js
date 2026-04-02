import notificationRepository from "../repositories/notificationRepository.js";

const notificationService = {

  getNotifications: async () => {

    return await notificationRepository.getNotifications();

  }

};

export default notificationService;