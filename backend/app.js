import express from "express";
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
import userRoutes from "./src/routes/user.routes.js";
import videoRoutes from "./src/routes/video.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import subscriptionRoutes from "./src/routes/subscription.routes.js";
import likeRoutes from "./src/routes/like.routes.js";
import commentRoutes from "./src/routes/comment.routes.js";
import path from "path";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,               // VERY IMPORTANT
  })
);

app.use("/hls",express.static(path.join(process.cwd(),"storage/hls")));

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/videos", videoRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/likes", likeRoutes);
app.use("/api/v1/comments", commentRoutes);



export default app;