import { Router } from "express";
import postController from "../controllers/postController.js";
import postCreateValidation from "../middlewares/postCreateValidation.js";
import postUpdateValidation from "../middlewares/postUpdateValidation.js";
import { protect } from "../middlewares/protect.js";
import { imageFileUpload } from "../middlewares/imageFileUpload.js";

const postRouter = Router();

postRouter.get("/", postController.getPosts);

postRouter.post(
  "/",
  protect,
  imageFileUpload,
  postCreateValidation,
  postController.createPost
);

postRouter.get("/:postId", postController.getPostById);

postRouter.put(
  "/:postId",
  protect,
  imageFileUpload,
  postUpdateValidation,
  postController.updatePostById
);

postRouter.delete("/:postId", protect, postController.deletePostById);

export default postRouter;