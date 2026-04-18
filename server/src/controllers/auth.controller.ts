import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/auth.service";

type RegisterBody = {
name?: string;
email: string;
password: string;
};

type LoginBody = {
email: string;
password: string;
};

export const register = async (
req: Request<{}, {}, RegisterBody>,
res: Response
) => {
try {
const { name, email, password } = req.body;


const user = await registerUser({ name, email, password });

const { password: _, ...safeUser } = user;

res.status(201).json({
  message: "User registered successfully",
  user: safeUser,
});


} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};

export const login = async (
req: Request<{}, {}, LoginBody>,
res: Response
) => {
try {
const { email, password } = req.body;


const { user, token } = await loginUser({ email, password });

const { password: _, ...safeUser } = user;

res.status(200).json({
  message: "Login successful",
  user: safeUser,
  token,
});


} catch (error: any) {
res.status(400).json({
error: error.message,
});
}
};
