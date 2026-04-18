import { Router } from "express";
import {
getDashboard,
logProgress,
updateGoal,
} from "../controllers/dashboard.controller";

const router = Router();

router.get("/", getDashboard);
router.put("/goal", updateGoal);
router.post("/progress", logProgress);

export default router;
