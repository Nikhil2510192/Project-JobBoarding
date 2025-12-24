import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const Signature = (req, res) => {
  try {
    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder: "resume",
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      timestamp,
      signature,
      folder: "resume",
    });
    
  } catch (err) {
    console.error("Signature Error:", err);
    res.status(500).json({ message: "Failed to generate signature" });
  }
};
