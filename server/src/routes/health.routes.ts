import { Router } from "express";
import { createOrUpdateProfile, getProfile } from "../controllers/health.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/profile", authMiddleware, createOrUpdateProfile);
router.get("/profile", authMiddleware, getProfile);

export default router;
