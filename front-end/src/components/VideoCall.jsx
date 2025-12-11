import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useChatStore } from "../store/useChatStore";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { selectedUser } = useChatStore();
  const { isCallActive, roomId, kitToken, endCall, setZegoEngine, setLocalStream } = useVideoCallStore();
  const callContainerRef = useRef(null);
  const instanceRef = useRef(null);

  useEffect(() => {
    if (!isCallActive || !roomId || !kitToken || !callContainerRef.current) return;

    let streamForCleanup = null;

    const initRoom = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        streamForCleanup = stream;
        setLocalStream(stream);

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        instanceRef.current = zp;
        setZegoEngine(zp);

        zp.joinRoom({
          container: callContainerRef.current,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
          sharedLinks: [
            {
              name: "Personal link",
              url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomId}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
            config: {
              role: "Host",
            },
          },
          onLeaveRoom: () => endCall(),
        });
      } catch (error) {
        console.error("Không thể truy cập camera/mic:", error);
        toast.error("Cần quyền camera và micro để thực hiện cuộc gọi");
        endCall();
      }
    };

    initRoom();

    return () => {
      streamForCleanup?.getTracks().forEach((track) => track.stop());
      instanceRef.current?.destroy?.();
      instanceRef.current = null;
    };
  }, [isCallActive, kitToken, roomId, endCall, setZegoEngine, setLocalStream]);

  if (!isCallActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div ref={callContainerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white">
        <p className="text-lg font-semibold">{selectedUser?.fullName}</p>
      </div>
    </div>
  );
};

export default VideoCall;

