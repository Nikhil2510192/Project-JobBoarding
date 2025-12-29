// routes/job.routes.js
import express from 'express';
import {
  createJob,
  applyToJob,
  shortlistUserForJob,
  rejectAppliedUser,
  getAppliedUsers,
  getShortlistedUsers,
  deleteJob,
  updateJob
} from '../controllers/jobControllers.js'; 
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();


// PROTECTED ROUTES (Authentication required)

// Create a new job (company only)
<<<<<<< HEAD
router.post('/create', authenticate, createJob);

// Apply to a specific job (user only)
router.post('/apply/:jobId', authenticate, applyToJob);

// Shortlist a user for a specific job (company only)
router.post('/shortlist/:jobId', authenticate, shortlistUserForJob);

// Reject an applied user from a specific job (company only)
router.delete('/reject/:jobId', authenticate, rejectAppliedUser);

// Get all users who applied to a specific job
router.get('/applied-users/:jobId', authenticate, getAppliedUsers);

// Get all shortlisted users for a specific job
router.get('/shortlisted-users/:jobId', authenticate, getShortlistedUsers);

// Delete a specific job
router.delete('/delete/:jobId', authenticate, deleteJob);
=======
router.post('/create', authenticate, createJob); //tested

// Apply to a specific job (user only)
router.post('/apply/:jobId', authenticate, applyToJob);  //tested

// Shortlist a user for a specific job (company only)
router.post('/shortlist/:jobId', authenticate, shortlistUserForJob); //tested

// Reject an applied user from a specific job (company only)
router.delete('/reject/:jobId', authenticate, rejectAppliedUser); //tested

// Get all users who applied to a specific job
router.get('/applied-users/:jobId', authenticate, getAppliedUsers);//tested

// Get all shortlisted users for a specific job
router.get('/shortlisted-users/:jobId', authenticate, getShortlistedUsers);//tested

// Delete a specific job
router.delete('/delete/:jobId', authenticate, deleteJob);//tested
>>>>>>> frontendv1

// Update a specific job
router.patch('/update/:jobId', authenticate, updateJob);


export default router;