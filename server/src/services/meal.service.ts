import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateMealPlan = async (userId: string) => {
const profile = await prisma.userHealthProfile.findUnique({
where: { userId },
});

if (!profile) {
throw new Error("User profile not found");
}

const prompt = `
Create a structured WEEKLY meal plan (7 days).

User Details:
Goal: ${profile.goal}
BMI: ${profile.bmiCategory}
Diet: ${profile.dietPreference}
Activity: ${profile.activityLevel}

IMPORTANT:
- Return ONLY valid JSON
- Do NOT include markdown or backticks
- Include calories
- Provide plan for all 7 days

Format:
{
  "monday": {
    "breakfast": { "meal": "...", "calories": number },
    "lunch": { "meal": "...", "calories": number },
    "dinner": { "meal": "...", "calories": number },
    "snacks": { "meal": "...", "calories": number },
    "totalCalories": number
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}
`;

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash",
});

const result = await model.generateContent(prompt);
const response = await result.response;
let text = response.text();

// 🔥 Remove markdown formatting if present
text = text.replace(/`json/g, "").replace(/`/g, "").trim();

// 🔥 Convert string → JSON
try {
const parsed = JSON.parse(text);
return parsed;
} catch (error) {
throw new Error("Failed to parse meal plan response");
}
};
