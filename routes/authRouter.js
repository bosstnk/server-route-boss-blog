import { Router } from "express";
import authController from "../controllers/authController.js";
import validateRegister from "../middlewares/validateRegister.js";
import validateLogin from "../middlewares/validateLogin.js";



const authRouter = Router();

authRouter.post(
    "/register",
    validateRegister,
    authController.register
);


authRouter.post(
    "/login",
    validateLogin,
    authController.login
);

export default authRouter