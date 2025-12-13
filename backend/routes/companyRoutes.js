// routes/company.routes.js
import express from 'express';
import {
  createCompany,
  loginCompany,
  getCompany,
  UpdateCompanyProfile,
  getRecommendedUsersForJob,
  getCompanyJobs
} from '../controllers/companyControllers.js'; 
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES (No authentication required)
// Create / register company
router.post('/register', createCompany);

// Login company
router.post('/login', loginCompany);

// PROTECTED ROUTES (Authentication required)
// Get  company details
router.get('/getcompany', authenticate, getCompany);

// Update company profile
router.patch('/updateprofile', authenticate, UpdateCompanyProfile); 

// Get recommended users for a specific job
// Note: jobId passed as URL parameter
router.get('/recommended-users/:jobId', authenticate, getRecommendedUsersForJob);
// Get jobs posted by the company
router.get('/getJobs', authenticate, getCompanyJobs);


export default router;