import  prisma  from '../db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'






export const createCompany = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("Received company data:", { name, email, password });

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if email already exists
    const existingCompany = await prisma.company.findUnique({
      where: { email }
    });

    if (existingCompany) {
      return res.status(400).json({
        message: "Email already taken. Please use another email."
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create company with only required fields
    const newCompany = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: newCompany.id, type: "company" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set auth cookie
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("Company created successfully:", newCompany);

    return res.status(201).json({ message: "Company registered successfully" });

  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};













export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      console.log("Validation failed: Missing email or password.");
      return res.status(400).json({ error: "email and password are required" });
    }

    // Find company by email
    const company = await prisma.company.findUnique({
      where: { email }
    });

    if (!company) {
      console.log("Company not found:", email);
      return res.status(400).json({ error: "company not found" });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, company.password);

    if (!isPasswordValid) {
      console.log("Invalid password for company:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create JWT token (with a role flag)
    const token = jwt.sign(
      { id: company.id, type: "company" }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    console.log("token", token);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    console.log("Company signed in");

    return res.json({ message: "Login successful", userType: "company" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};









export const getCompany = async (req, res) => {
  try {
    const companyId = Number(req.user.id);

    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        name: true,
        email: true,
        description: true,
        website: true,
        location: true,
      }
    });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({
      message: "Company retrieved successfully",
      company
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }
};








export const UpdateCompanyProfile = async (req, res) => {
  try {
    const companyId = Number(req.user.id);

    if (isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    // Extract only fields allowed to update
    const {
      name,
      description,
      website,
      location
    } = req.body;

    // Check whether company exists
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company) {
      console.log("Company not found with ID:", companyId);
      return res.status(404).json({ message: "Company not found" });
    }

    // Build update object dynamically (only fields sent in req.body)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (location !== undefined) updateData.location = location;

    const updatedCompany = await prisma.company.update({
      where: { id: companyId },
      data: updateData
    });

    console.log("Company profile updated:", updatedCompany);

    return res.status(200).json({
      message: "Company profile updated successfully",
      company: updatedCompany
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }
};




export const getRecommendedUsersForJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const companyId = Number(req.user.id); // logged-in company from JWT

    if (Number.isNaN(jobId) || Number.isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid jobId or companyId" });
    }

    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Only companies can view recommendations" });
    }

    // 1) Load job and verify ownership
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      select: {
        id: true,
        role: true,
        experience: true,
        number: true
      }
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not owned by this company" });
    }

    const requiredExperience = job.experience ?? 0;

    // 2) Fetch candidate pool:
    //    - openToInterview.status == "yes"
    //    - role matches job.role (case-insensitive)
    //    - experience >= job.experience (basic filter)
    const candidates = await prisma.user.findMany({
      where: {
        openToInterview: {
          path: ["status"],
          equals: "yes"
        },
        role: {
          equals: job.role,
          mode: "insensitive"
        },
        experience: requiredExperience
          ? { gte: requiredExperience }
          : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        experience: true,
        skills: true,
        openToInterview: true,
        resumes: {
          select: {
            id: true,
            score: true
          }
        }
      }
    });

    if (candidates.length === 0) {
      return res.status(200).json({
        message: "No matching candidates found",
        recommendedUsers: []
      });
    }

    // 3) Compute top resume score per candidate & sort in JS
    const withScore = candidates.map(user => {
      const bestResume = user.resumes.reduce(
        (best, r) => (best == null || (r.score ?? 0) > (best.score ?? 0) ? r : best),
        null
      );

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        experience: user.experience,
        skills: user.skills,
        openToInterview: user.openToInterview,
        bestResumeScore: bestResume?.score ?? 0
      };
    });

    // Sort descending by resume score
    withScore.sort((a, b) => b.bestResumeScore - a.bestResumeScore);

    // 4) Limit results based on job.number 
    const maxCount = job.number && job.number > 0
      ? Math.min(job.number, withScore.length)
      : withScore.length;

    const recommendedUsers = withScore.slice(0, maxCount);

    return res.status(200).json({
      message: "Recommended users fetched successfully",
      job: {
        id: job.id,
        role: job.role,
        experience: job.experience,
        openings: job.number
      },
      recommendedUsers
    });

  } catch (error) {
    console.error("Error fetching recommended users:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};



export const getCompanyJobs = async (req, res) => {
  try {
    const companyId = Number(req.user.id);

    if (!companyId || Number.isNaN(companyId)) {
      return res.status(400).json({ message: "Invalid or missing company id" });
    }

    const jobs = await prisma.job.findMany({
      where: { companyId },
      select: {
        id: true,
        role: true,
        salary: true,
        deadline: true,
        company: {
          select: { id: true, name: true }
        }
      }
    });

    return res.status(200).json({
      message: "Jobs fetched successfully",
      jobs,
    });
  } catch (error) {
    console.error("Error fetching company jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
