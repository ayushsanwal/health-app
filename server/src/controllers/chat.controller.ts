import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateChatResponse } from "../services/chat.service";

export const chat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId || null;
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const reply = await generateChatResponse(userId, message);

    res.status(200).json({ reply });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};