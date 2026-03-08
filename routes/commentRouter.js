import { Router } from "express";
import commentController from "../controllers/commentController.js";
import { protect } from "../middlewares/protect.js";

const commentRouter = Router();

commentRouter.get("/:postId/comments", commentController.getComments);

commentRouter.post(
  "/:postId/comments",
  protect,
  commentController.createComment
);

commentRouter.delete(
  "/comments/:id",
  protect,
  commentController.deleteComment
);

export default commentRouter;