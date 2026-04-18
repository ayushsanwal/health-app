import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import apiRoutes from "./routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Root route
app.get("/", (req, res) => {
res.send("Server is up 🚀");
});

export default app;
