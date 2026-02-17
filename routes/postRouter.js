import { Router } from "express";
import postController from "../controllers/postController.js";
import postCreateValidation from "../middlewares/postCreateValidation.js";
import postUpdateValidation from "../middlewares/postUpdateValidation.js";
import { protect } from "../middlewares/protect.js";

const postRouter = Router();

postRouter.get("/", postController.getPosts);


postRouter.post(
    "/",
    protect,
    postCreateValidation,
    postController.createPost
  );

postRouter.get("/:postId", postController.getPostById);

postRouter.put(
  "/:postId",
  protect,
  postUpdateValidation,
  postController.updatePostById
);

postRouter.delete("/:postId",protect, postController.deletePostById)


export default postRouter;
