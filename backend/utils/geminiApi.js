
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function analyzeResumeWithGemini(resumeText) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
    GEMINI_API_KEY;


  const systemInstruction = `
You are an expert technical recruiter. 
You will receive the full text of a candidate's resume. 
Your task is to analyze it and populate the required JSON object.
`;

  const body = {
    contents: [
      {
        parts: [{ text: `Here is the resume text:\n\n${resumeText}` }],
      },
    ],
    config: {
      // 1. Force the model to output a JSON string
      responseMimeType: "application/json", 
      // 2. Define the exact structure the model MUST follow
      responseSchema: {
        type: "object",
        properties: {
          // Use 'number' type for score in the schema
          score: {
            type: "number",
            description: "An overall resume score from 0 to 100.",
          },
          strengths: {
            type: "string",
            description: "A description of the top strengths of the resume.",
          },
          improvements: {
            type: "string",
            description: "A description of what can be improved in the resume.",
          },
        },
        required: ["score", "strengths", "improvements"],
      },
      // 3. (Optional but recommended) Separate system prompt
      systemInstruction: systemInstruction.trim(), 
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    // ... Error handling remains the same ...
    const errText = await res.text().catch(() => "");
    throw new Error(`Gemini request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();

  // The model's response text will now be a guaranteed, valid JSON string.
  const text =
    data?.candidates?.[0]?.content?.parts?.[0]?.text ??
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ??
    null;

  if (!text) {
    throw new Error("Gemini response missing text");
  }

  // No more reliance on LLM to follow text instructions for JSON format!
  // The model response *is* the JSON, just parse it.
  const parsed = JSON.parse(text);

  // The schema ensures the properties exist and score is a number.
  // We can simplify the final check.
  const score = Number(parsed.score); // Use Number() to ensure type safety in JS
  const strengths = String(parsed.strengths);
  const improvements = String(parsed.improvements);

  if (Number.isNaN(score)) {
    throw new Error("Gemini score is invalid even after parsing.");
  }

  return {
    score,
    strengths,
    improvements,
  };
}
