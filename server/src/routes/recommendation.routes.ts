import { Router } from "express";
import { getUserRecommendations } from "../controllers/recommendation.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, getUserRecommendations);

export default router;
