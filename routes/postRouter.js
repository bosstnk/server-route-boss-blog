import { Router } from "express";
import postController from "../controllers/postController.js";
import postCreateValidation from "../middlewares/postCreateValidation.js";
import postUpdateValidation from "../middlewares/postUpdateValidation.js";

const postRouter = Router();

postRouter.get("/", postController.getPosts);


postRouter.post(
    "/",
    postCreateValidation,
    postController.createPost
  );

postRouter.get("/:postId", postController.getPostById);

postRouter.put(
  "/:postId",
  postUpdateValidation,
  postController.updatePostById
);

postRouter.delete("/:postId", postController.deletePostById)


export default postRouter;
