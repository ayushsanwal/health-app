import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { generateMealPlan } from "../services/meal.service";

export const generateUserMealPlan = async (
req: AuthRequest,
res: Response
) => {
try {
const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const mealPlan = await generateMealPlan(userId);

res.status(200).json({
  message: "Meal plan generated successfully",
  mealPlan,
});

} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};
