import { useVideoCallStore } from "../store/useVideoCallStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { PhoneOff } from "lucide-react";

const Calling = () => {
  const { isCalling, setIsCalling, roomId } = useVideoCallStore();
  const { selectedUser } = useChatStore();
  const { socket } = useAuthStore();

  const handleCancel = () => {
    if (socket && roomId && selectedUser) {
      socket.emit("video:reject", { to: selectedUser._id, roomId });
    }
    setIsCalling(false);
  };

  if (!isCalling || !selectedUser) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-base-300 rounded-xl p-8 text-center space-y-6 min-w-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-24 rounded-full overflow-hidden border-4 border-primary animate-pulse">
            <img
              src={selectedUser.profilePic || "/avatar.png"}
              alt={selectedUser.fullName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{selectedUser.fullName}</h2>
            <p className="text-base-content/70 mt-2">Đang gọi...</p>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleCancel}
            className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Calling;

