// backend/Middlewares/app.js

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "../routes/routes.js";

const app = express();

// ✅ MUST be first — body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ✅ CORS
app.use(cors({
  origin: "http://localhost:8080",
  credentials: true
}));

// ✅ Cookies
app.use(cookieParser());

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Job Portal API is running",
    status: "ok"
  });
});

// ✅ Routes AFTER middleware
app.use("/api", routes);

// Static files (optional)
app.use(express.static("public"));

export { app };