import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
import { protect } from "../middlewares/protect.js";
import { isAdmin } from "../middlewares/isAdmin.js";
import validateCategory from "../middlewares/validateCategory.js";

const categoryRouter = Router();

categoryRouter.get("/", categoryController.getCategories);

categoryRouter.get("/:id",protect, isAdmin, categoryController.getCategoryById);

categoryRouter.post("/", protect, isAdmin, validateCategory, categoryController.createCategory);

categoryRouter.put("/:id", protect, isAdmin, validateCategory, categoryController.updateCategory);

categoryRouter.delete("/:id", protect, isAdmin, categoryController.deleteCategory);

export default categoryRouter;