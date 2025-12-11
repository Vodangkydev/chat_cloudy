import express from "express";

const router = express.Router();

// Placeholder route to keep the video module wired.
router.get("/config", (req, res) => {
  res.json({
    appId: process.env.ZEGO_APP_ID,
    serverSecret: process.env.ZEGO_SECRET_KEY,
  });
});

export default router;

