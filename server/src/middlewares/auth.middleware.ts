import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

export interface AuthRequest extends Request {
user?: {
userId: string;
email: string;
};
}

export const authMiddleware = (
req: AuthRequest,
res: Response,
next: NextFunction
) => {
try {
const authHeader = req.headers.authorization;


if (!authHeader) {
  return res.status(401).json({ error: "No token provided" });
}

const token = authHeader.split(" ")[1];

const decoded = jwt.verify(token, JWT_SECRET) as {
  userId: string;
  email: string;
};

req.user = decoded;

next();


} catch (error) {
return res.status(401).json({ error: "Invalid token" });
}
};
