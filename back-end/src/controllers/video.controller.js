import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export const generateVideoToken = (req, res) => {
  try {
    const { roomId, userId, userName } = req.body;
    if (!roomId || !userId) {
      return res.status(400).json({ message: "roomId và userId là bắt buộc" });
    }

    const appID = Number(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_SECRET_KEY;

    if (!appID || !serverSecret) {
      return res.status(500).json({ message: "Thiếu cấu hình ZEGO trên server" });
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName || "Cloudy User"
    );

    return res.json({ token: kitToken });
  } catch (error) {
    console.error("generateVideoToken error:", error);
    return res.status(500).json({ message: "Không thể tạo token cuộc gọi" });
  }
};

