import express from "express"
import { checkAuth, signup, login, logout, updateProfile } from "../controllers/auth.controllers.js"
import { protectRound } from "../middleware/auth.middleware.js"
const router = express.Router();
router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-profile", protectRound, updateProfile)

router.get("/check", protectRound, checkAuth)
export default router;
