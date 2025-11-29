import express from "express"
import { protectRound } from "../middleware/auth.middleware.js"
import {getUsersForSidebar, getMessages, sendMessage} from "../controllers/message.controller.js"

const router = express.Router();

router.get("/users", protectRound, getUsersForSidebar)
router.get("/:id", protectRound, getMessages)
router.post("/send/:id", protectRound, sendMessage)
export default router;

