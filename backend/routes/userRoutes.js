// routes/user.routes.js
import express from 'express';
import {
  createUser,
  login,
  logout,
  UserProfile,
  getUser,
  getAppliedJobs,
  getDiscoverJobs
} from '../controllers/userControllers.js'; 
import { authenticate } from "../Middlewares/authMiddleware.js";

const router = express.Router();


// PUBLIC ROUTES (No authentication required)
// Create / register user
<<<<<<< HEAD
router.post('/register', createUser);

// Login user
router.post('/login', login);
=======
router.post('/register', createUser);  //tested

// Login user
router.post('/login', login);  //tested
>>>>>>> frontendv1



// PROTECTED ROUTES (Authentication required)
// Logout user
<<<<<<< HEAD
router.post('/logout', authenticate, logout);

// Get logged-in user details
router.get('/getuser', authenticate, getUser);

// Update user profile
router.patch('/updateprofile', authenticate, UserProfile);

// Get all jobs applied by the user
router.get('/applied-jobs', authenticate, getAppliedJobs);
=======
router.post('/logout', authenticate, logout); //tested

// Get logged-in user details
router.get('/getuser', authenticate, getUser);  //tested

// Update user profile
router.patch('/updateprofile', authenticate, UserProfile);  //tested   

// Get all jobs applied by the user
router.get('/applied-jobs', authenticate, getAppliedJobs);  //tested
>>>>>>> frontendv1

// Get recommended/discover jobs for user based on their role
router.get('/discover-jobs', authenticate, getDiscoverJobs);


export default router;