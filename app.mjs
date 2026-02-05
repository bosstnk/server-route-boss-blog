import 'dotenv/config'
import express from "express";
import cors from "cors";
import connectionPool from './data/db.mjs';

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://route-boss-blog-git-dev-boss-projects-a246840e.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.get("/posts",async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT * FROM posts")
    return res.status(200).json({
      data : result.rows
    })
  } catch (error) {
    return res.status(500).json({
      message:"Unable to fetch posts"
    })
  }
})

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}`);
  });
}

export default app;