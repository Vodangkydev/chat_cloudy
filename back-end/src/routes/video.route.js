import express from "express";
import { protectRound } from "../middleware/auth.middleware.js";
import { generateVideoToken } from "../controllers/video.controller.js";

const router = express.Router();

router.post("/token", protectRound, generateVideoToken);
router.get("/health", (req, res) => res.json({ status: "ok" }));

export default router;

