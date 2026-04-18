import { Router } from "express";
import { generateUserMealPlan } from "../controllers/meal.controller";

const router = Router();

router.post("/generate", generateUserMealPlan);

export default router;
