import { useEffect, useRef, useState } from "react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { ZegoExpressEngine } from "zego-express-engine-webrtc";

const VideoCall = () => {
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();
  const { isCallActive, token, appId, appSign, roomId, setZegoEngine, setLocalStream, endCall, isCaller } = useVideoCallStore();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const zegoEngineRef = useRef(null);
  const localStreamRef = useRef(null);

  useEffect(() => {
    if (!isCallActive || !token || !roomId || !appId || !appSign) return;

    const initCall = async () => {
      try {
        const engine = new ZegoExpressEngine(appId, appSign);
        zegoEngineRef.current = engine;
        setZegoEngine(engine);

        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = mediaStream;
        localVideoRef.current.srcObject = mediaStream;
        setLocalStream(mediaStream);

        engine.on("roomStreamUpdate", async (roomID, updateType, streamList) => {
          if (updateType === "ADD") {
            for (const stream of streamList) {
              const remoteStream = await engine.startPlayingStream(stream.streamID);
              remoteVideoRef.current.srcObject = remoteStream;
            }
          } else if (updateType === "DELETE") {
            remoteVideoRef.current.srcObject = null;
          }
        });

        await engine.loginRoom(roomId, token, { userID: authUser._id, userName: authUser.fullName });
        await engine.startPublishingStream(`stream_${authUser._id}_${Date.now()}`, mediaStream);
      } catch (error) {
        console.error("Error initializing call:", error);
      }
    };

    initCall();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (zegoEngineRef.current) {
        zegoEngineRef.current.logoutRoom();
        zegoEngineRef.current.destroy();
      }
    };
  }, [isCallActive, token, roomId, appId, appSign, authUser]);

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((track) => (track.enabled = isMuted));
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    localStreamRef.current?.getVideoTracks().forEach((track) => (track.enabled = isVideoOff));
    setIsVideoOff(!isVideoOff);
  };

  if (!isCallActive) return null;

  const mainVideo = isCaller ? remoteVideoRef : localVideoRef;
  const smallVideo = isCaller ? localVideoRef : remoteVideoRef;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gray-900">
          <video ref={mainVideo} autoPlay playsInline className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-20 right-4 w-48 h-64 rounded-lg overflow-hidden border-2 border-white bg-gray-800">
          <video ref={smallVideo} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4">
          <button onClick={toggleMute} className={`p-3 rounded-full ${isMuted ? "bg-red-500" : "bg-base-content/20"} text-white`}>
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <button onClick={toggleVideo} className={`p-3 rounded-full ${isVideoOff ? "bg-red-500" : "bg-base-content/20"} text-white`}>
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>
          <button onClick={endCall} className="p-3 rounded-full bg-red-500 text-white">
            <PhoneOff size={20} />
          </button>
        </div>
        <div className="absolute top-4 left-4 text-white">
          <p className="text-lg font-semibold">{selectedUser?.fullName}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;

