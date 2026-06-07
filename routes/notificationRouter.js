import { Router } from "express";
import notificationController from "../controllers/notificationController.js";
import { protect } from "../middlewares/protect.js";

const notificationRouter = Router();

notificationRouter.get(
  "/",
  protect,
  notificationController.getNotifications
);

notificationRouter.patch(
  "/read-all",
  protect,
  notificationController.markAllAsRead
);

export default notificationRouter;