// routes/resume.routes.js
import express from 'express';
import {
  saveResume,
  deleteResume,
  analyzeResume,
  getResumeForUser
} from '../controllers/resumeControllers.js'; 
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();


// PROTECTED ROUTES (Authentication required)

// Save/upload a new resume for logged-in user
router.post('/save', authenticate, saveResume);

// Delete a specific resume (user must own it)
router.delete('/delete/:resumeId', authenticate, deleteResume);

// Analyze a specific resume with Gemini AI (user must own it)
router.post('/analyze/:resumeId', authenticate, analyzeResume);

// Get resume for a specific user (company access only)
router.get('/getresume/:userId', authenticate, getResumeForUser);


export default router;