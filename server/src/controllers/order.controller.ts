import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { checkout, getUserOrders } from "../services/order.service";

export const checkoutOrder = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;
const { addressId } = req.body; 

if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

if (!addressId) {
  return res.status(400).json({ error: "Address ID is required" });
}

const order = await checkout(userId, addressId);

res.status(200).json({
  message: "Order placed successfully",
  order,
});


} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};

export const getOrders = async (req: AuthRequest, res: Response) => {
try {
const userId = req.user?.userId;

if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const orders = await getUserOrders(userId);

res.status(200).json({ orders });


} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};
