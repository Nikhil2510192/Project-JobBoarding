import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import routes from "../routes/routes.js";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials : true
}))
<<<<<<< HEAD

app.use("/api",routes)

app.use(express.json({limit:"16kb"}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))

app.use(express.static("public"))

app.use(cookieParser())

 export {app}
=======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", (req, res) => {
  res.status(200).json({ message: "Job Portal API is running", status: "ok" });
});

app.use("/api",routes)

app.use(express.static("public"))

export default app;
>>>>>>> frontendv1

