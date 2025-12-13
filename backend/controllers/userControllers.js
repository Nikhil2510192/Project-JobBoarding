import  prisma  from '../db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
dotenv.config();

export const createUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        message: "Request body is missing"
      });
    }

    const { name, email, password } = req.body;

    console.log("Received data:", { name, email, password });

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // rest of your existing code stays SAME 👇
  const findUser = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (findUser) {
      console.log("Email already taken:", email);
      return res.status(400).json({
          status: 400,
          message: "Email already taken, please use another email."
      });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPassword, 
    },
  });
const token = jwt.sign(
        { id: newUser.id, type: "user" }, 
        process.env.JWT_SECRET, 
        { expiresIn: "7d" }
        );
res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
        });
 console.log("User created successfully:", newUser);
 return res.json({ status: 200, msg: "User created." });
}
 catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ status: 500, message: "Internal Server Error" });
}}













export const login= async (req, res) => {
try {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Validation failed: Missing email or password.");
    return res
      .status(400)
      .json({ error: 'email and password are required' });
  }
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'user not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
  { id: user.id, type: "user" }, 
  process.env.JWT_SECRET, 
  { expiresIn: "7d" }
   );

        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
    console.log('user signed in');
    res.json({ message: 'Login Successfull' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });}
  }









   export const logout = (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.status(400).send({ "message": "No cookie is present" });
        }

        res.clearCookie('token', {
            httpOnly: process.env.NODE_ENV === 'production',
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.status(200).send({ "message": "Logout successful" });
    } catch (error) {
        console.error("Error in logout", error);
        return res.status(500).send({ "message": "Internal Server Error" });
    }
};










export const UserProfile = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    const {
      name,
      bio,
      portfolioSite,
      linkedIn,
      github,
      experience,
      company,
      position,
      currentlyWorking,
      description,
      education,
      college,
      fieldOfStudy,
      skills,
      role,
      otherRoles,
      openToInterview // <-- newly added
    } = req.body;

    // Check existing user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Build dynamic update object
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (portfolioSite !== undefined) updateData.portfolioSite = portfolioSite;
    if (linkedIn !== undefined) updateData.linkedIn = linkedIn;
    if (github !== undefined) updateData.github = github;
    if (experience !== undefined) updateData.experience = Number(experience);
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (currentlyWorking !== undefined) updateData.currentlyWorking = Boolean(currentlyWorking);
    if (description !== undefined) updateData.description = description;
    if (education !== undefined) updateData.education = education;
    if (college !== undefined) updateData.college = college;
    if (fieldOfStudy !== undefined) updateData.fieldOfStudy = fieldOfStudy;
    if (skills !== undefined) updateData.skills = skills;
    if (role !== undefined) updateData.role = role;
    if (otherRoles !== undefined) updateData.otherRoles = otherRoles;
    if (openToInterview !== undefined) {
      updateData.openToInterview = openToInterview;

    }

    // Update DB
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};







export const getUser = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      // avoid returning password in response
      select: {
        name: true,
        email: true,
        role: true,
        otherRoles: true,
        bio: true,
        portfolioSite: true,
        linkedIn: true,
        github: true,
        experience: true,
        company: true,
        position: true,
        currentlyWorking: true,
        description: true,
        education: true,
        college: true,
        fieldOfStudy: true,
        skills: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User retrieved successfully",
      user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error
    });
  }
};







export const getAppliedJobs = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
  const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    appliedJobs: {
      select: {
        id: true,
        role: true,
        salary: true,
        deadline: true,   // added
        company: { select: { id: true, name: true } }
      }
    }
  }
});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  const result = user.appliedJobs.map(job => ({
  jobId: job.id,
  role: job.role,
  salary: job.salary,
  deadline: job.deadline,
  company: job.company
}));
    return res.status(200).json({
      message: "Applied jobs fetched successfully",
      jobs: result
    });
  } catch (error) {
    console.error("Error fetching job statuses:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};









export const getDiscoverJobs = async (req, res) => {
  try {
    const userId = Number(req.user.id);

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // 1. Get user to know their role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. Fetch jobs that match user role
    const jobs = await prisma.job.findMany({
      where: {
        role: {
          equals: user.role,
          mode: "insensitive" // optional, avoids case issues
        }
      },
      select: {
        id: true,
        role: true,
        salary: true,
        deadline: true,
        company: { select: { id: true, name: true } }
      }
    });

    // 3. Transform response format
    const formattedJobs = jobs.map(job => ({
      jobId: job.id,
      role: job.role,
      salary: job.salary,
      deadline: job.deadline,
      company: job.company
    }));

    return res.status(200).json({
      message: "Recommended jobs fetched successfully",
      jobs: formattedJobs
    });

  } catch (error) {
    console.error("Error fetching recommended jobs:", error);
    return res.status(500).json({ 
      message: "Internal Server Error", 
      error: error.message 
    });
  }
};
