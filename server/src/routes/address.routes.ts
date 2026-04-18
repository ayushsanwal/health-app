import { Router } from "express";
import {
createUserAddress,
getUserAddresses,
deleteUserAddress,
} from "../controllers/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/add", authMiddleware, createUserAddress);
router.get("/", authMiddleware, getUserAddresses);

// 🔥 FIXED: use path param instead of body
router.delete("/:addressId", authMiddleware, deleteUserAddress);

export default router;
