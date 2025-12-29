import axios from "axios";
import mammoth from "mammoth";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

// Download file from URL and return as buffer
async function downloadFile(url) {
  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });
  return response.data;
}

// Extract text from PDF buffer
async function extractPdf(buffer) {
  const result = await pdfParse(buffer);
  return result.text || "";
}

// Extract text from DOCX buffer
async function extractDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}

// Main exported parser
export async function pdfParser(fileUrl) {
  try {
    if (!fileUrl) throw new Error("File URL missing");

    const lowerUrl = fileUrl.toLowerCase();

    // 1️⃣ Download file into memory
    const fileBuffer = await downloadFile(fileUrl);

    // 2️⃣ Determine file type
    if (lowerUrl.endsWith(".pdf")) {
      return (await extractPdf(fileBuffer)).trim();
    }

    if (lowerUrl.endsWith(".docx")) {
      return (await extractDocx(fileBuffer)).trim();
    }

    throw new Error("Unsupported file type. Only PDF and DOCX allowed.");
  } catch (err) {
    console.error("Error in pdfParser:", err.message);
    return "";
  }
}
