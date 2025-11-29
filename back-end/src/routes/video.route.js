import express from "express";
import { getZegoToken } from "../controllers/video.controller.js";
import { protectRound } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/token", protectRound, getZegoToken);

export default router;




