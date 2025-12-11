import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { axiosInstance } from "../lib/axios";

const VideoCall = () => {
  const containerRef = useRef(null);
  const [kitToken, setKitToken] = useState(null);
  const { isCallActive, currentRoomId, endCall } = useVideoCallStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    const fetchTokenAndJoin = async () => {
      if (!isCallActive || !currentRoomId || !authUser || !containerRef.current) {
        return;
      }

      try {
        const res = await axiosInstance.post("/video/token", {
          roomId: currentRoomId,
          userId: authUser._id,
          userName: authUser.fullName || "Người dùng",
        });

        if (!res.data?.token) {
          throw new Error("Không nhận được token cuộc gọi");
        }

        setKitToken(res.data.token);

        const zp = ZegoUIKitPrebuilt.create(res.data.token);
        zp.joinRoom({
          container: containerRef.current,
          sharedLinks: [
            {
              name: "Liên kết cuộc gọi",
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${currentRoomId}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          showPreJoinView: false,
          onLeaveRoom: () => endCall(),
        });

        return () => {
          try {
            zp.destroy();
          } catch (error) {
            console.error("Không thể huỷ phiên Zego:", error);
          }
        };
      } catch (error) {
        console.error("Không thể lấy token cuộc gọi:", error);
        endCall();
      }
    };

    const cleanup = fetchTokenAndJoin();
    return () => {
      if (cleanup && typeof cleanup === "function") cleanup();
    };
  }, [isCallActive, currentRoomId, authUser, endCall]);

  if (!isCallActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-base-200 rounded-2xl overflow-hidden shadow-2xl">
        <button
          onClick={() => endCall()}
          className="btn btn-circle btn-sm absolute right-3 top-3 z-10"
          aria-label="Đóng cuộc gọi"
        >
          <X className="w-4 h-4" />
        </button>
        <div ref={containerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default VideoCall;

