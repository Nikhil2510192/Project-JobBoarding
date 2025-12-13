import jwt from "jsonwebtoken";
import  prisma  from "../db.config.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const { id, type } = decodedToken;

    // Fetch user/company from DB to ensure account still exists
    let account = type === "company"
      ? await prisma.company.findUnique({ where: { id }, select: { id: true, name: true, email: true } })
      : await prisma.user.findUnique({ where: { id }, select: { id: true, name: true, email: true } });

    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    // Attach authenticated identity to request
    req.user = { id: account.id, type };

    next();

  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
