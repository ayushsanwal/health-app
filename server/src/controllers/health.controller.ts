import { Response } from "express";
import { saveHealthProfile, fetchHealthProfile } from "../services/health.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export const createOrUpdateProfile = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const profile = await saveHealthProfile(userId, req.body);

res.status(200).json({
  message: "Profile saved successfully",
  profile,
});


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const getProfile = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const profile = await fetchHealthProfile(userId);

res.status(200).json({ profile });

} catch (error: any) {
res.status(400).json({ error: error.message });
}
};
