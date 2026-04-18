import { GoogleGenerativeAI } from "@google/generative-ai";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const generateChatResponse = async (
  userId: string | null,
  message: string
) => {
  let context = "";

  // 🔥 PERSONALIZATION (if logged in)
  if (userId) {
    const profile = await prisma.userHealthProfile.findUnique({
      where: { userId },
    });

    if (profile) {
      context = `
User Details:
Goal: ${profile.goal}
BMI: ${profile.bmiCategory}
Diet: ${profile.dietPreference}
Activity: ${profile.activityLevel}
`;
    }
  }

  const prompt = `
You are a helpful AI health assistant.

${context}

User Question:
${message}

Guidelines:
- Give clear, helpful answers
- Keep it concise
- If relevant, suggest diet, fitness tips, or products
- Avoid overly long responses
`;

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const result = await model.generateContent(prompt);
  const response = await result.response;

  return response.text();
};