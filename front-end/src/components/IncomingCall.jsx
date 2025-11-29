import { useEffect } from "react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useAuthStore } from "../store/useAuthStore";
import { Phone, PhoneOff } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const IncomingCall = () => {
  const { isIncomingCall, callerInfo, roomId, setIncomingCall, startCall, setCallActive, setRoomId, setIsCaller } = useVideoCallStore();
  const { socket } = useAuthStore();
  const { setSelectedUser } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = ({ roomId, callerInfo }) => {
      setIncomingCall(true, callerInfo, roomId);
    };

    const handleCallAccepted = async ({ roomId }) => {
      try {
        await startCall(roomId);
        setCallActive(true);
        setIncomingCall(false, null, null);
      } catch (error) {
        console.error("Failed to start call after accept:", error);
      }
    };

    const handleCallRejected = () => {
      setIncomingCall(false, null, null);
      toast.error("Cuộc gọi đã bị từ chối");
    };

    const handleCallEnded = () => {
      setIncomingCall(false, null, null);
      const { isCallActive } = useVideoCallStore.getState();
      if (isCallActive) {
        useVideoCallStore.getState().endCall();
      }
    };

    socket.on("video:incoming", handleIncomingCall);
    socket.on("video:accepted", handleCallAccepted);
    socket.on("video:rejected", handleCallRejected);
    socket.on("video:ended", handleCallEnded);

    return () => {
      socket.off("video:incoming", handleIncomingCall);
      socket.off("video:accepted", handleCallAccepted);
      socket.off("video:rejected", handleCallRejected);
      socket.off("video:ended", handleCallEnded);
    };
  }, [socket, startCall, setCallActive, setRoomId, setIncomingCall]);

  const handleAccept = async () => {
    if (!socket || !roomId || !callerInfo) return;
    try {
      await startCall(roomId);
      setIsCaller(false);
      setCallActive(true);
      setIncomingCall(false, null, null);
      socket.emit("video:accept", { to: callerInfo._id, roomId });
      setSelectedUser(callerInfo);
    } catch (error) {
      console.error("Failed to accept call:", error);
    }
  };

  const handleReject = () => {
    if (!socket || !roomId || !callerInfo) return;
    socket.emit("video:reject", { to: callerInfo._id, roomId });
    setIncomingCall(false, null, null);
  };

  if (!isIncomingCall || !callerInfo) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-base-300 rounded-xl p-8 text-center space-y-6 min-w-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 rounded-full overflow-hidden border-4 border-primary">
            <img
              src={callerInfo.profilePic || "/avatar.png"}
              alt={callerInfo.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{callerInfo.fullName}</h2>
            <p className="text-base-content/70 mt-2">Đang gọi video...</p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleReject}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <PhoneOff size={24} />
          </button>
          <button
            onClick={handleAccept}
            className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            <Phone size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;

