import { Router } from "express";
import postController from "../controllers/postController.js";
import { protect } from "../middlewares/protect.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const adminPostRouter = Router();

adminPostRouter.get("/posts", protect, isAdmin, postController.getAdminPosts);

export default adminPostRouter;
