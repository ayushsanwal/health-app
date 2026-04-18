import { Router } from "express";
import { addItem, getCart, removeItem } from "../controllers/cart.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", authMiddleware, addItem);
router.get("/", authMiddleware, getCart);
router.delete("/remove", authMiddleware, removeItem);

export default router;
