import { Router } from "express";
import { getPrediction } from "../controllers/predictController.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ error: "No token provided" });

    try {
        req.user = jwt.verify(token, process.env.SESSION_KEY);
        next();
    } catch (e) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

router.post("/predict", verifyToken,getPrediction);

export default router;