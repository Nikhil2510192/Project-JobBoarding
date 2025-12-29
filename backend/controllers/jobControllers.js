import  prisma  from '../db.config.js';
import { notifyUser } from "../utils/socketHelper.js"; 


export const createJob = async (req, res) => {
  try {
    const companyId = Number(req.user.id);
    if (req.user.type !== "company") {
         return res.status(403).json({ message: "Only companies can create jobs" });
       }

    if (!companyId || Number.isNaN(companyId)) {
      return res.status(400).json({ message: 'Invalid or missing company id ' });
    }

    const {
      job_id,
      salary,
      role,
      skills,
      number,
      experience,
      deadLine,
    } = req.body;

    // Basic validation
    if (
<<<<<<< HEAD
      job_id === undefined ||
=======
>>>>>>> frontendv1
      salary === undefined ||
      !role ||
      skills === undefined ||
      number === undefined ||
      experience === undefined ||
      !deadLine
    ) {
      return res.status(400).json({ message: 'All job fields are required' });
    }

    // Parse deadline to Date
    const deadlineDate = new Date(deadLine);
    if (Number.isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: 'Invalid deadLine date format' });
    }

    // If skills comes as JSON string from frontend, you can optionally parse:
    // const parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;

    const newJob = await prisma.job.create({
      data: {
<<<<<<< HEAD
        job_id: Number(job_id),
=======
>>>>>>> frontendv1
        salary: Number(salary),
        role,
        skills,                 // or skills: parsedSkills
        number: Number(number),
        experience: Number(experience),
        deadLine: deadlineDate,
        companyId,
      },
    });

    console.log('Job created:', newJob.id);

    return res.status(201).json({
      message: 'Job created successfully',
      job: newJob,
    });
  } catch (error) {
    console.error('Error creating job:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};





export const applyToJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const userId = Number(req.user.id);

    if (req.user.type !== "user") {
       return res.status(403).json({ message: "Only users can apply to jobs" });
    }


    if (!jobId || Number.isNaN(jobId) || !userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid jobId or userId in params" });
    }

    // Check if Job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { usersApplied: { select: { id: true } } }
    });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if User already applied
    const alreadyApplied = job.usersApplied.some(u => u.id === userId);
    if (alreadyApplied) {
      return res.status(409).json({ message: "User has already applied to this job" });
    }

    // Connect user to applied list
    await prisma.job.update({
      where: { id: jobId },
      data: {
        usersApplied: {
          connect: { id: userId }
        }
      }
    });

    console.log(`User ${userId} applied to job ${jobId}`);

    return res.status(200).json({
      message: "Application submitted successfully"
    });

  } catch (error) {
    console.error("Error applying to job:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};



<<<<<<< HEAD




=======
>>>>>>> frontendv1
export const shortlistUserForJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const { userId } = req.body;
    const userIdNum = Number(userId);
    const companyId = Number(req.user.id);

    if (Number.isNaN(jobId) || Number.isNaN(userIdNum)) {
      return res.status(400).json({ message: "Invalid jobId or userId" });
    }

    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Only companies can shortlist" });
    }

    // Get job with user details for notification
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        usersApplied: { select: { id: true } },
        usersShortlisted: { select: { id: true } },
<<<<<<< HEAD
        company: { // Get company info for notification
=======
        company: {
>>>>>>> frontendv1
          select: {
            name: true,
            id: true
          }
        }
      },
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not owned by this company" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userIdNum },
<<<<<<< HEAD
      select: { id: true, email: true, name: true }, // Get user details
=======
      select: { id: true, email: true, name: true },
>>>>>>> frontendv1
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hasApplied = job.usersApplied.some((u) => u.id === userIdNum);
    const alreadyShortlisted = job.usersShortlisted.some(
      (u) => u.id === userIdNum
    );

    if (alreadyShortlisted) {
      return res
        .status(200)
        .json({ message: "User is already shortlisted for this job" });
    }

    const updateData = {
      usersShortlisted: {
        connect: { id: userIdNum },
      },
    };

    if (hasApplied) {
      updateData.usersApplied = {
        disconnect: { id: userIdNum },
      };
    }

    // Update database
    await prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });

<<<<<<< HEAD
    // Send real-time notification to the user
    notifyUser(userIdNum, "job_status_updated", {
=======
    // -------------------------
    // CHANGED: obtain io from Express app (no circular import)
    const io = req.app.get("io"); // CHANGED

    // Prepare notification payload
    const payload = {
>>>>>>> frontendv1
      type: "shortlisted",
      jobId: jobId,
      jobTitle: job.role || job.title,
      companyName: job.company.name,
      message: `Congratulations! You've been shortlisted for the ${job.role} position at ${job.company.name}`,
      timestamp: new Date().toISOString(),
      status: "shortlisted"
<<<<<<< HEAD
    });
=======
    };

    // CHANGED: notifyUser is now async and returns { delivered: boolean }
    const notifyResult = await notifyUser(io, userIdNum, "job_status_updated", payload); // CHANGED
>>>>>>> frontendv1

    return res.status(200).json({
      message: hasApplied
        ? "User moved from applied to shortlisted"
        : "User added directly to shortlisted",
<<<<<<< HEAD
      notificationSent: true // Optional: confirm notification was sent
=======
      notificationSent: notifyResult?.delivered ?? false // CHANGED: reflect actual delivery
>>>>>>> frontendv1
    });
  } catch (error) {
    console.error("Error shortlisting user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};










<<<<<<< HEAD
export const rejectAppliedUser = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const candidateId = Number(req.params.userId); // candidate being rejected
=======


// Existing controller (modified minimally)
export const rejectAppliedUser = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);
    const { userId } = req.body;
    const candidateId = Number(userId);// candidate being rejected
>>>>>>> frontendv1
    const companyId = Number(req.user.id);         // logged-in company

    if (Number.isNaN(jobId) || Number.isNaN(candidateId)) {
      return res.status(400).json({ message: "Invalid jobId or userId" });
    }

    if (req.user.type !== "company") {
      return res.status(403).json({ message: "Only companies can reject users" });
    }

    // Get job with company info for notification
    const job = await prisma.job.findFirst({
      where: { id: jobId, companyId },
      include: {
        usersApplied: { select: { id: true } },
        company: { // Get company info for notification
          select: {
            name: true,
            id: true
          }
        }
      },
    });

    if (!job) {
      return res
        .status(404)
        .json({ message: "Job not found or not owned by this company" });
    }

    const isApplied = job.usersApplied.some((u) => u.id === candidateId);

    if (!isApplied) {
      return res.status(409).json({
        message: "User is not in applied list or already rejected",
      });
    }

    // Update database
    await prisma.job.update({
      where: { id: jobId },
      data: {
        usersApplied: {
          disconnect: { id: candidateId },
        },
      },
    });

    // ✅ WEB SOCKET NOTIFICATION FOR REJECTION
<<<<<<< HEAD
    notifyUser(candidateId, "job_status_updated", {
=======
    // CHANGED: obtain io from Express app to avoid circular imports
    const io = req.app.get("io"); // CHANGED

    const payload = {
>>>>>>> frontendv1
      type: "rejected",
      jobId: jobId,
      jobTitle: job.role || job.title,
      companyName: job.company.name,
      message: `Your application for ${job.role} at ${job.company.name} has been reviewed. We appreciate your interest.`,
      timestamp: new Date().toISOString(),
      status: "rejected"
<<<<<<< HEAD
    });
=======
    };

    // CHANGED: use async notifyUser(io, ...) and capture result
    const notifyResult = await notifyUser(io, candidateId, "job_status_updated", payload); // CHANGED
>>>>>>> frontendv1

    // Get updated job data for response
    const updatedJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        usersApplied: {
          select: { id: true, name: true, email: true },
        },
        usersShortlisted: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return res.status(200).json({
      message: "User rejected and removed from applied list",
<<<<<<< HEAD
      notificationSent: true, // Confirm WebSocket was sent
=======
      notificationSent: notifyResult?.delivered ?? false, // CHANGED: reflect actual delivery
>>>>>>> frontendv1
      appliedUsers: updatedJob.usersApplied,
      shortlistedUsers: updatedJob.usersShortlisted,
    });
  } catch (error) {
    console.error("Error rejecting user:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};










<<<<<<< HEAD



=======
>>>>>>> frontendv1
export const getAppliedUsers = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!jobId || Number.isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        usersApplied: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({
      message: 'Applied users fetched successfully',
      appliedUsers: job.usersApplied,
    });

  } catch (error) {
    console.error('Error fetching applied users:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};












export const getShortlistedUsers = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!jobId || Number.isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        usersShortlisted: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({
      message: 'Shortlisted users fetched successfully',
      shortlistedUsers: job.usersShortlisted,
    });

  } catch (error) {
    console.error('Error fetching shortlisted users:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};







export const deleteJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!jobId || Number.isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    // Check job existence
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { id: true }
    });

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    await prisma.job.delete({
      where: { id: jobId }
    });

    return res.status(200).json({ message: 'Job deleted successfully' });

  } catch (error) {
    console.error('Error deleting job:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};





export const updateJob = async (req, res) => {
  try {
    const jobId = Number(req.params.jobId);

    if (!jobId || Number.isNaN(jobId)) {
      return res.status(400).json({ message: 'Invalid jobId' });
    }

    const {
      job_id,
      salary,
      role,
      skills,
      number,
      experience,
      deadLine
    } = req.body;

    // Build update object dynamically
    const updateData = {};

    if (job_id !== undefined) updateData.job_id = Number(job_id);
    if (salary !== undefined) updateData.salary = Number(salary);
    if (role !== undefined) updateData.role = role;
    if (skills !== undefined) updateData.skills = skills;
    if (number !== undefined) updateData.number = Number(number);
    if (experience !== undefined) updateData.experience = Number(experience);

    if (deadLine !== undefined) {
      const deadlineDate = new Date(deadLine);
      if (Number.isNaN(deadlineDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format for deadLine' });
      }
      updateData.deadLine = deadlineDate;
    }

    // Update operation
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: updateData,
    });

    return res.status(200).json({
      message: 'Job updated successfully',
      updatedJob,
    });

  } catch (error) {
    console.error('Error updating job:', error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};












