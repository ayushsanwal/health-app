import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { addToCart, viewCart, removeFromCart } from "../services/cart.service";

export const addItem = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;
const { productId, quantity } = req.body;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const cart = await addToCart(userId, productId, quantity || 1);

res.status(200).json({ cart });


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const getCart = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const cart = await viewCart(userId);

res.status(200).json({ cart });


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const removeItem = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;
const { productId, quantity } = req.body;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const cart = await removeFromCart(
  userId,
  productId,
  quantity || 1
);

res.status(200).json({ cart });


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};
