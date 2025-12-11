import { Phone, PhoneCall, PhoneOff } from "lucide-react";
import { useVideoCallStore } from "../store/useVideoCallStore";

const CallOverlay = () => {
  const {
    incomingCall,
    outgoingCall,
    acceptCall,
    rejectCall,
    cancelOutgoingCall,
    isConnecting,
  } = useVideoCallStore();

  const activeCall = incomingCall || outgoingCall;
  if (!activeCall) return null;

  const displayName = incomingCall
    ? incomingCall.callerInfo.name
    : outgoingCall?.callee?.fullName;
  const displayAvatar = incomingCall
    ? incomingCall.callerInfo.avatar
    : outgoingCall?.callee?.profilePic;
  const statusText = incomingCall ? "Cuộc gọi đến" : "Đang gọi...";
  const subStatus = isConnecting
    ? "Đang kết nối..."
    : incomingCall
      ? "Bấm nhận để tham gia"
      : "Đợi người nhận";

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-black/75 via-black/70 to-black/80 backdrop-blur-lg flex items-center justify-center px-4">
      <div className="max-w-lg w-full p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/10 bg-white/5">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="avatar">
            <div className="w-16 sm:w-20 rounded-full ring ring-primary/50 ring-offset-2 ring-offset-black/40 overflow-hidden">
              <img src={displayAvatar || "/avatar.png"} alt={displayName} />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-wide text-white/70">{statusText}</p>
            <p className="text-2xl font-semibold text-white">{displayName}</p>
            <p className="text-xs sm:text-sm text-white/60">{subStatus}</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 sm:gap-8 mt-8">
          {incomingCall ? (
            <>
              <button
                onClick={rejectCall}
                className="btn btn-circle btn-lg bg-red-500/80 hover:bg-red-500 text-white border-none shadow-lg shadow-red-500/30"
                aria-label="Từ chối"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
              <button
                onClick={acceptCall}
                className="btn btn-circle btn-lg bg-emerald-500/80 hover:bg-emerald-500 text-white border-none shadow-lg shadow-emerald-500/30"
                aria-label="Chấp nhận"
              >
                <PhoneCall className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={cancelOutgoingCall}
              className="btn btn-circle btn-lg bg-red-500/80 hover:bg-red-500 text-white border-none shadow-lg shadow-red-500/30"
              title="Huỷ cuộc gọi"
              aria-label="Huỷ cuộc gọi"
            >
              <Phone className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;

