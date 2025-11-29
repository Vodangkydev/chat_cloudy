import { generateZegoToken } from "../lib/zegocloud.js";

export const getZegoToken = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { roomId } = req.body;

    if (!roomId) {
      return res.status(400).json({ message: "Room ID is required" });
    }

    const token = generateZegoToken(userId, roomId);
    const appId = parseInt(process.env.ZEGO_APP_ID);
    const appSign = process.env.ZEGO_SECRET_KEY;
    if (!appId || !appSign) {
      return res.status(500).json({ message: "ZEGO configuration is not set" });
    }
    res.status(200).json({ token, appId, appSign });
  } catch (error) {
    console.log("Error generating ZEGO token:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

