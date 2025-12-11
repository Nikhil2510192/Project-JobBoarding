import { Router } from "express";
import UserRoutes from "./userRoutes.js";
import ResumeRoutes from "./resumeRoutes.js";
import JobRoutes from "./jobRoutes.js";
import CompanyRoutes from "./companyRoutes.js";
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = Router();

// * For User Routes
router.use("/user", UserRoutes);

// * For JobRoutes
router.use("/job",authenticate, JobRoutes);

// * For ResumeRoutes
router.use("/resume",authenticate,ResumeRoutes);

// * For CompanyRoutes
router.use("/company", CompanyRoutes);

export default router;