import { Router } from "express";
import likeController from "../controllers/likeController.js";
import { protect } from "../middlewares/protect.js";

const likeRouter = Router();

/*
  POST /posts/:postId/like

  ใช้ API เส้นเดียวสำหรับ toggle like

  behaviour
  - ถ้า user ยังไม่ like → create like
  - ถ้า user like แล้ว → delete like
*/
likeRouter.post(
  "/:postId/like",
  protect,
  likeController.toggleLike
);

export default likeRouter;