import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
fetchDashboard,
saveDailyProgress,
saveDashboardGoal,
} from "../services/dashboard.service";

export const getDashboard = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;

if (!userId) {
return res.status(401).json({ error: "Unauthorized" });
}

const dashboard = await fetchDashboard(userId);

res.status(200).json({ dashboard });
} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;

if (!userId) {
return res.status(401).json({ error: "Unauthorized" });
}

const goal = await saveDashboardGoal(userId, req.body);

res.status(200).json({
message: "Goal saved successfully",
goal,
});
} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const logProgress = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;

if (!userId) {
return res.status(401).json({ error: "Unauthorized" });
}

const progress = await saveDailyProgress(userId, req.body);

res.status(200).json({
message: "Progress saved successfully",
progress,
});
} catch (error: any) {
res.status(400).json({ error: error.message });
}
};
