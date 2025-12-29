// routes/resume.routes.js
import express from 'express';
import {
  saveResume,
  deleteResume,
  analyzeResume,
  getResumeForUser
} from '../controllers/resumeControllers.js'; 
<<<<<<< HEAD
=======
import { Signature } from '../utils/cloudinary.js';
>>>>>>> frontendv1
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();


// PROTECTED ROUTES (Authentication required)

<<<<<<< HEAD
// Save/upload a new resume for logged-in user
router.post('/save', authenticate, saveResume);
=======
// Get Cloudinary signature for secure upload
router.get('/signature', authenticate, Signature); //tested   //after getting signature frontend should directly upload resume in cloudinary and after saving ,cloudinary will send the url and public id 
// Save/upload a new resume for logged-in user                //u should trigger these two routes when the button save resume is clicked ,one is to get the signature and the other to save the resume after getting url and public id from cloudinary
router.post('/save', authenticate, saveResume);               //after u get the url and public id from cloudinary ,send it to backend using this route
>>>>>>> frontendv1

// Delete a specific resume (user must own it)
router.delete('/delete/:resumeId', authenticate, deleteResume);

// Analyze a specific resume with Gemini AI (user must own it)
router.post('/analyze/:resumeId', authenticate, analyzeResume);

// Get resume for a specific user (company access only)
router.get('/getresume/:userId', authenticate, getResumeForUser);


export default router;