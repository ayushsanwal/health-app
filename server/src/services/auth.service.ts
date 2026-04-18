import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../repositories/user.repository";

const JWT_SECRET = "your_secret_key"; // later move to .env

export const registerUser = async (data: {
name?: string;
email: string;
password: string;
}) => {
const existingUser = await findUserByEmail(data.email);

if (existingUser) {
throw new Error("User already exists");
}

const hashedPassword = await bcrypt.hash(data.password, 10);

const user = await createUser({
...data,
password: hashedPassword,
});

return user;
};

export const loginUser = async (data: {
email: string;
password: string;
}) => {
const user = await findUserByEmail(data.email);

if (!user) {
throw new Error("Invalid credentials");
}

const isMatch = await bcrypt.compare(data.password, user.password);

if (!isMatch) {
throw new Error("Invalid credentials");
}

// Generate JWT
const token = jwt.sign(
{ userId: user.id, email: user.email },
JWT_SECRET,
{ expiresIn: "1d" }
);

return { user, token };
};
