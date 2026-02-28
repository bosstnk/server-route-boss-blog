import { Router } from "express";
import userController from "../controllers/userController.js";
import { protect } from "../middlewares/protect.js";
import { createClient } from "@supabase/supabase-js";
import { imageFileUpload } from "../middlewares/imageFileUpload.js";
import { validateProfileUpdate } from "../middlewares/validateProfileUpdate.js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);


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
    userController.resetPassword
  );

export default userRouter