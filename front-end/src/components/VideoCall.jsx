import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { axiosInstance } from "../lib/axios";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useAuthStore } from "../store/useAuthStore";

const VideoCall = () => {
  const containerRef = useRef(null);
  const { isCallActive, currentRoomId, endCall } = useVideoCallStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (!isCallActive || !currentRoomId || !authUser || !containerRef.current) {
      return;
    }

    let isMounted = true;
    let zegoInstance = null;

    const setupCall = async () => {
      try {
        const res = await axiosInstance.get("/video/config");
        const { appId, serverSecret } = res.data || {};

        if (!appId || !serverSecret) {
          throw new Error("Thiếu cấu hình Zego từ máy chủ");
        }

        if (!isMounted) return;

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          Number(appId),
          serverSecret,
          currentRoomId,
          authUser._id,
          authUser.fullName || "Người dùng"
        );

        zegoInstance = ZegoUIKitPrebuilt.create(kitToken);
        zegoInstance.joinRoom({
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
      } catch (error) {
        console.error("Không thể khởi tạo cuộc gọi Zego:", error);
        endCall();
      }
    };

    setupCall();

    return () => {
      isMounted = false;
      try {
        zegoInstance?.destroy();
      } catch (error) {
        console.error("Không thể huỷ phiên Zego:", error);
      }
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

