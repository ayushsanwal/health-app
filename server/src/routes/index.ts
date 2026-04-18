import { Router } from "express";
import authRoutes from "./auth.routes";
import healthRoutes from "./health.routes";
import recommendationRoutes from "./recommendation.routes";
import cartRoutes from "./cart.routes";
import orderRoutes from "./order.routes";
import addressRoutes from "./address.routes";
import mealRoutes from "./meal.routes"; 
import { authMiddleware, AuthRequest } from "../middlewares/auth.middleware";
import productRoutes from "./product.routes";
import chatRoutes from "./chat.routes";
import dashboardRoutes from "./dashboard.routes";

const router = Router();

router.get("/", (req, res) => {
res.json({ message: "API working 🚀" });
});

router.get("/protected", authMiddleware, (req: AuthRequest, res) => {
res.json({
message: "Protected route accessed",
user: req.user,
});
});

// Public routes
router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/products", productRoutes);
router.use("/chat", chatRoutes);

// 🔒 Protected routes
router.use("/recommendations", authMiddleware, recommendationRoutes);
router.use("/cart", authMiddleware, cartRoutes);
router.use("/orders", authMiddleware, orderRoutes);
router.use("/address", authMiddleware, addressRoutes);
router.use("/meal", authMiddleware, mealRoutes);
router.use("/dashboard", authMiddleware, dashboardRoutes);

export default router;

