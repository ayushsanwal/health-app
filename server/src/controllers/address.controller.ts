import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import {
addAddress,
viewAddresses,
removeAddress,
} from "../services/address.service";

export const createUserAddress = async (
req: AuthRequest,
res: Response
) => {
try {
const userId = req.user?.userId;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const address = await addAddress(userId, req.body);

res.status(201).json({
  message: "Address added successfully",
  address,
});


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const getUserAddresses = async (
req: AuthRequest,
res: Response
) => {
try {
const userId = req.user?.userId;


if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

const addresses = await viewAddresses(userId);

res.status(200).json({ addresses });


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};

export const deleteUserAddress = async (
req: AuthRequest,
res: Response
) => {
try {
const userId = req.user?.userId;



const addressId = (req.params as { addressId: string }).addressId;

if (!userId) {
  return res.status(401).json({ error: "Unauthorized" });
}

if (!addressId) {
  return res.status(400).json({ error: "Address ID is required" });
}

const result = await removeAddress(userId, addressId);

res.status(200).json({
  message: "Address removed",
  result,
});


} catch (error: any) {
res.status(400).json({ error: error.message });
}
};
