import express from "express";

const router = express.Router();

// Placeholder route to keep the video module wired.
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;

