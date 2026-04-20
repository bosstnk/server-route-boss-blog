import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middlewares/protect.js";
import { imageFileUpload } from "../middlewares/imageFileUpload.js";
import { validateProfileUpdate } from "../middlewares/validateProfileUpdate.js";
import { validateResetPassword } from "../middlewares/validateResetPassword.js";


const userRouter = Router()

userRouter.get("/", protect, userController.getUserById);

userRouter.put(
    "/",
    protect,
    imageFileUpload,
    validateProfileUpdate,
    userController.updateProfile
);

userRouter.put(
    "/reset-password",
    protect,
    validateResetPassword,
    userController.resetPassword
  );

export default userRouter