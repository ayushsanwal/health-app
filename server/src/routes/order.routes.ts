import { Router } from "express";
import { checkoutOrder, getOrders } from "../controllers/order.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/checkout", authMiddleware, checkoutOrder);
router.get("/", authMiddleware, getOrders);

export default router;
