import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import postRouter from './routes/postRouter.js';
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';
import categoryRouter from './routes/categoryRouter.js';
import commentRouter from './routes/commentRouter.js';
import likeRouter from './routes/likeRouter.js';
import notificationRouter from './routes/notificationRouter.js';
import adminPostRouter from './routes/adminPostRouter.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = ["http://localhost:5173", "http://localhost:3000"];
      const isVercel = origin && origin.endsWith(".vercel.app");
      if (!origin || allowed.includes(origin) || isVercel) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/health", async (_req, res) => {
  try {
    await connectionPool.query("SELECT 1");
    console.log("✅ [HEALTH] DB ping ok");
    res.json({ status: "ok" });
  } catch (error) {
    console.error("💥 [HEALTH] DB ping failed", { message: error.message });
    res.status(500).json({ status: "error" });
  }
});

app.use("/posts", postRouter)
app.use("/posts", commentRouter);
app.use("/posts", likeRouter);
app.use("/categories", categoryRouter);
app.use("/notifications", notificationRouter)
app.use("/admin", adminPostRouter)
app.use("/auth", authRouter)
app.use("/user", userRouter)

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

export default app;