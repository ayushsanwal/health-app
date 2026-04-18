import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { getRecommendations } from "../services/recommendation.service";

export const getUserRecommendations = async (
req: AuthRequest,
res: Response
) => {
try {
const userId = req.user?.userId;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const limit = req.query.limit
  ? Number(req.query.limit)
  : undefined;

const recommendations = await getRecommendations(userId, limit);

res.status(200).json({
  recommendations,
});


} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};
