import  prisma  from '../db.config.js';
import { v2 as cloudinary } from "cloudinary";
import { analyzeResumeWithGemini } from "../utils/geminiApi.js";
import { pdfParser } from '../utils/pdfParser.js';



// POST /users/:id/resume
export const saveResume = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const { resumeUrl, cloudinaryId } = req.body;

    console.log("Received resume data:", { userId, resumeUrl, cloudinaryId });

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing user id" });
    }

    if (!resumeUrl) {
      return res.status(400).json({ message: "resumeUrl is required" });
    }

    if (!cloudinaryId) {
      return res.status(400).json({ message: "cloudinaryId is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1️⃣ Create resume row *without* waiting for pdfParser
    const resume = await prisma.resume.create({
      data: {
        user_id: userId,
        resumeUrl,
        cloudinaryId,
        // resumeText will be filled later
      },
    });

    console.log("Resume row created:", resume.id);

    // 2️⃣ Respond to frontend *immediately*
    res.status(201).json({
      message: "Resume saved. Processing text in background.",
      resumeId: resume.id,
    });

    // 3️⃣ After response, start heavy work in background (do NOT await)
    pdfParser(resumeUrl)
      .then(async (resumeText) => {
        // Clean and save extracted text
        await prisma.resume.update({
          where: { id: resume.id },
          data: {
            resumeText,
          },
        });
        console.log("Resume text saved for resume:", resume.id);
      })
      .catch(async (err) => {
        console.error("Error parsing resume PDF:", err);
      });

  } catch (error) {
    console.error("Error saving resume:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};














export const deleteResume = async (req, res) => {
  try {
    const resumeId = Number(req.params.resumeId);
    const userId = Number(req.user.id); // or from req.user.id if using auth

    if (!resumeId || Number.isNaN(resumeId)) {
      return res.status(400).json({ message: "Invalid or missing resume id" });
    }

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing user id" });
    }

    // 1) Find the resume
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: {
        id: true,
        user_id: true,
        cloudinaryId: true,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // 2) Authorization: ensure it belongs to this user
    if (resume.user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this resume" });
    }

    // 3) Delete from Cloudinary first
    // PDFs are usually uploaded as resource_type "raw"
    const cloudinaryResult = await cloudinary.uploader.destroy(resume.cloudinaryId, {
      resource_type: "raw",
    });

    console.log("Cloudinary delete result:", cloudinaryResult);


    // 4) Delete from DB
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return res.status(200).json({
      message: "Resume deleted from DB and Cloudinary",
      deletedResumeId: resumeId,
      cloudinaryResult,
    });
  } catch (error) {
    console.error("Error deleting resume:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};










export const analyzeResume = async (req, res) => {
  try {
    const resumeId = Number(req.params.resumeId);
    const userId = Number(req.user.id) || req.user?.id; // adjust based on your auth

    if (!resumeId || Number.isNaN(resumeId)) {
      return res.status(400).json({ message: "Invalid or missing resume id" });
    }

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing user id" });
    }

    // 1️⃣ Fetch resume from DB
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
      select: {
        id: true,
        user_id: true,
        resumeText: true,
        resumeScore: true,
        good: true,
        improve: true,
      },
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Auth guard: ensure this resume belongs to this user
    if (resume.user_id !== userId) {
      return res.status(403).json({ message: "Not authorized to analyze this resume" });
    }

    if (!resume.resumeText || resume.resumeText.trim().length === 0) {
      return res.status(400).json({
        message: "resumeText is empty or not processed yet. Please wait for extraction.",
      });
    }

    // 2️⃣ Call Gemini with the resume text
    console.log("Sending resume to Gemini for analysis, resumeId:", resumeId);

    const { score, strengths, improvements } = await analyzeResumeWithGemini(
      resume.resumeText
    );

    console.log("Gemini analysis result:", {
      score,
      strengthsPreview: strengths.slice(0, 80),
      improvementsPreview: improvements.slice(0, 80),
    });

    // 3️⃣ Save results in DB
    const updated = await prisma.resume.update({
      where: { id: resumeId },
      data: {
        resumeScore: score,
        good: strengths,
        improve: improvements,
      },
      select: {
        id: true,
        resumeScore: true,
        good: true,
        improve: true,
      },
    });

    // 4️⃣ Return to frontend
    return res.status(200).json({
      message: "Resume analyzed successfully",
      resumeId: updated.id,
      resumeScore: updated.resumeScore,
      good: updated.good,
      improve: updated.improve,
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
};





export const getResumeForUser = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // Ensure requester is authenticated as a company
    if (req.auth.type !== "company") {
      return res.status(403).json({
        message: "Only companies can view resumes"
      });
    }

    if (!userId || Number.isNaN(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch the latest resume for the user
    const resume = await prisma.resume.findFirst({
      where: { userId },
      select: {
        resumeUrl: true
      }
    });

    if (!resume) {
      return res.status(404).json({ message: "No resume found for this user" });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      url: resume.resumeUrl
    });

  } catch (error) {
    console.error("Error fetching resume:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


