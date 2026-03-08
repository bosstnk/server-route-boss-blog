import { Router } from "express";
import notificationController from "../controllers/notificationController.js";
import { protect } from "../middlewares/protect.js";

const notificationRouter = Router();

notificationRouter.get(
  "/notifications",
  protect,
  notificationController.getNotifications
);

export default notificationRouter;