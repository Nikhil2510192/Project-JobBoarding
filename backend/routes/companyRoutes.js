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
router.post('/register', createCompany);  //tested

// Login company
router.post('/login', loginCompany);  //tested

// PROTECTED ROUTES (Authentication required)
// Get  company details
router.get('/getcompany', authenticate, getCompany); //tested

// Update company profile
router.patch('/updateprofile', authenticate, UpdateCompanyProfile);  //tested

// Get recommended users for a specific job
router.get('/recommended-users/:jobId', authenticate, getRecommendedUsersForJob);

// Get jobs posted by the company
router.get('/getJobs', authenticate, getCompanyJobs);


export default router;