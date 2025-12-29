import prisma from '../db.config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Received data:", { name, email, password });
        if (!name || !email || !password) {
            console.log("Validation failed: Missing required fields.");
            return res.status(400).send({ "message": "All Fields are required" });
        }
        const findUser = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (findUser) {
            console.log("Email already taken:", email);
            return res.json({
                status: 400,
                message: "Email Already Taken . please another email.",
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log("User created successfully:", newUser);
        return res.json({ status: 200, msg: "User created." });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ status: 500, message: "Internal Server Error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("Validation failed: Missing email or password.");
            return res
                .status(400)
                .json({ error: 'email and password are required' });
        }
        
        // Include resumes to check if user has uploaded one
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                resumes: { select: { id: true } }
            }
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        console.log('user signed in');

        // CALCULATE FLAGS FOR FRONTEND
        const profileCompleted = !!(user.role && user.skills && user.experience !== null);
        const resumeUploaded = user.resumes && user.resumes.length > 0;

        // RETURN USER OBJECT SO FRONTEND DOESN'T WAIT FOR REFRESH
        return res.json({ 
            message: 'Login Successfull',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted, 
                resumeUploaded
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const logout = (req, res) => {
    try {
        // Even if cookie is missing, we can return 200 to allow frontend to clear state
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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
            openToInterview
        } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

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

        // Include resumes to check count
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                resumes: { select: { id: true } }
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // CALCULATE FLAGS
        const profileCompleted = !!(user.role && user.skills && user.experience !== null);
        const resumeUploaded = user.resumes && user.resumes.length > 0;

        // Construct safe user object
        const safeUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            otherRoles: user.otherRoles,
            bio: user.bio,
            portfolioSite: user.portfolioSite,
            linkedIn: user.linkedIn,
            github: user.github,
            experience: user.experience,
            company: user.company,
            position: user.position,
            currentlyWorking: user.currentlyWorking,
            description: user.description,
            education: user.education,
            college: user.college,
            fieldOfStudy: user.fieldOfStudy,
            skills: user.skills,
            profileCompleted, // Sent to frontend
            resumeUploaded    // Sent to frontend
        };

        return res.status(200).json({
            message: "User retrieved successfully",
            user: safeUser
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
                        deadLine: true,
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
            deadLine: job.deadLine,
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

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { role: true }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const jobs = await prisma.job.findMany({
            where: {
                role: {
                    equals: user.role,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                role: true,
                salary: true,
                deadLine: true,
                company: { select: { id: true, name: true } }
            }
        });

        const formattedJobs = jobs.map(job => ({
            jobId: job.id,
            role: job.role,
            salary: job.salary,
            deadLine: job.deadLine,
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