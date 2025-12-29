import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "../routes/routes.js";

const app = express()

// FIXED CORS configuration:
app.use(cors({
  origin: function(origin, callback) {
    // Accept both with and without trailing slash
    if (origin === 'http://localhost:8080' || origin === 'http://localhost:8080/'  ||  origin === 'http://192.168.29.243:8080') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true  // ← THIS IS THE FIX! Add this line
}));

app.use(express.json());
app.use(cookieParser())

app.get("/", (req, res) => {
  res.status(200).json({ message: "Job Portal API is running", status: "ok" });
});

app.use("/api", routes)
app.use(express.static("public"))

export default app;