import { Router } from "express";
import { chat } from "../controllers/chat.controller";
import { optionalAuthMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// 🌐 OPTIONAL AUTH (guest + logged-in both allowed)
router.post("/", optionalAuthMiddleware, chat);

export default router;