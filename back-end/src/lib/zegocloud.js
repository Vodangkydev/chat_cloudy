import crypto from "crypto";

export const generateZegoToken = (userId, roomId) => {
  const appId = process.env.ZEGO_APP_ID;
  const secret = process.env.ZEGO_SECRET_KEY;
  
  if (!appId || !secret) {
    throw new Error("ZEGO_APP_ID and ZEGO_SECRET_KEY must be defined in environment variables");
  }
  
  const appIdNum = parseInt(appId);
  if (isNaN(appIdNum)) {
    throw new Error("ZEGO_APP_ID must be a valid number");
  }
  const effectiveTimeInSeconds = 3600;
  const payload = {
    app_id: appIdNum,
    user_id: userId,
    nonce: Math.floor(Math.random() * 2147483647),
    ctime: Math.floor(Date.now() / 1000),
    expire: Math.floor(Date.now() / 1000) + effectiveTimeInSeconds,
    payload: {
      room_id: roomId,
    },
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64");
  const hash = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("hex");
  const signature = Buffer.from(hash).toString("base64");
  const token = `${encodedPayload}.${signature}`;

  return token;
};

