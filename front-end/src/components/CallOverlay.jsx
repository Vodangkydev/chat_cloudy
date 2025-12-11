import { Phone, PhoneOff } from "lucide-react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const CallOverlay = () => {
  const { selectedUser } = useChatStore();
  const {
    isIncomingCall,
    callerInfo,
    isCalling,
    acceptIncomingCall,
    rejectIncomingCall,
    cancelOutgoingCall,
  } = useVideoCallStore();

  // Keep auth store subscribed so socket updates propagate
  useAuthStore();

  const showIncoming = isIncomingCall && callerInfo;
  const showOutgoing = isCalling && selectedUser;

  if (!showIncoming && !showOutgoing) return null;

  const avatar = showIncoming ? callerInfo.profilePic : selectedUser?.profilePic;
  const name = showIncoming ? callerInfo.fullName : selectedUser?.fullName;
  const statusText = showIncoming ? "Đang gọi video..." : "Đang gọi...";

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <div className="bg-base-300 rounded-xl p-8 text-center space-y-6 min-w-[300px]">
        <div className="flex flex-col items-center gap-4">
          <div className={`size-24 rounded-full overflow-hidden border-4 border-primary ${showOutgoing ? "animate-pulse" : ""}`}>
            <img
              src={avatar || "/avatar.png"}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-base-content/70 mt-2">{statusText}</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {showIncoming ? (
            <>
              <button
                onClick={rejectIncomingCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              >
                <PhoneOff size={24} />
              </button>
              <button
                onClick={acceptIncomingCall}
                className="p-4 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              >
                <Phone size={24} />
              </button>
            </>
          ) : (
            <button
              onClick={cancelOutgoingCall}
              className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
            >
              <PhoneOff size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;


