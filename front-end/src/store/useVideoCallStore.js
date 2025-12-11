import { create } from "zustand";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

const initialState = {
  incomingCall: null, // { roomId, callerInfo }
  outgoingCall: null, // { callee, roomId }
  currentRoomId: null,
  isCallActive: false,
  isConnecting: false,
  peerUserId: null,
};

export const useVideoCallStore = create((set, get) => ({
  ...initialState,

  subscribeToSocketEvents: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return () => {};

    const handleIncoming = ({ roomId, callerInfo }) => {
      set({
        incomingCall: { roomId, callerInfo },
        outgoingCall: null,
        currentRoomId: roomId,
        isConnecting: false,
        peerUserId: callerInfo.id,
      });
    };

    const handleAccepted = ({ roomId }) => {
      const { outgoingCall } = get();
      set({
        isCallActive: true,
        incomingCall: null,
        outgoingCall: null,
        currentRoomId: roomId,
        isConnecting: false,
        peerUserId: outgoingCall?.callee?._id || null,
      });
    };

    const handleRejected = () => {
      toast.error("Cuộc gọi đã bị từ chối");
      set({ ...initialState });
    };

    const handleEnded = () => {
      toast("Cuộc gọi đã kết thúc");
      set({ ...initialState });
    };

    socket.off("video:incoming", handleIncoming);
    socket.off("video:accepted", handleAccepted);
    socket.off("video:rejected", handleRejected);
    socket.off("video:ended", handleEnded);

    socket.on("video:incoming", handleIncoming);
    socket.on("video:accepted", handleAccepted);
    socket.on("video:rejected", handleRejected);
    socket.on("video:ended", handleEnded);

    return () => {
      socket.off("video:incoming", handleIncoming);
      socket.off("video:accepted", handleAccepted);
      socket.off("video:rejected", handleRejected);
      socket.off("video:ended", handleEnded);
    };
  },

  initiateCall: async (callee) => {
    const { authUser, socket } = useAuthStore.getState();
    if (!authUser || !socket) {
      toast.error("Không thể thực hiện cuộc gọi");
      return;
    }

    const roomId = `${[authUser._id, callee._id].sort().join("-")}-${Date.now()}`;

    socket.emit("video:call", {
      to: callee._id,
      roomId,
      callerInfo: {
        id: authUser._id,
        name: authUser.fullName,
        avatar: authUser.profilePic,
      },
    });

    set({
      outgoingCall: { callee, roomId },
      incomingCall: null,
      currentRoomId: roomId,
      isConnecting: true,
      isCallActive: false,
      peerUserId: callee._id,
    });

    toast.success(`Đang gọi ${callee.fullName}`);
  },

  acceptCall: () => {
    const { incomingCall } = get();
    const { socket } = useAuthStore.getState();
    if (!incomingCall || !socket) return;

    socket.emit("video:accept", {
      to: incomingCall.callerInfo.id,
      roomId: incomingCall.roomId,
    });

    set({
      isCallActive: true,
      currentRoomId: incomingCall.roomId,
      incomingCall: null,
      isConnecting: false,
      peerUserId: incomingCall.callerInfo.id,
    });
  },

  rejectCall: () => {
    const { incomingCall } = get();
    const { socket } = useAuthStore.getState();
    if (!incomingCall || !socket) return;

    socket.emit("video:reject", {
      to: incomingCall.callerInfo.id,
      roomId: incomingCall.roomId,
    });
    set({ ...initialState });
  },

  cancelOutgoingCall: () => {
    const { outgoingCall, peerUserId } = get();
    const { socket } = useAuthStore.getState();
    if (!outgoingCall || !socket) return;

    socket.emit("video:end", {
      to: peerUserId || outgoingCall.callee._id,
      roomId: outgoingCall.roomId,
    });
    set({ ...initialState });
  },

  endCall: (silent = false) => {
    const { currentRoomId, outgoingCall, incomingCall, isCallActive, peerUserId } = get();
    const { socket } = useAuthStore.getState();
    const targetId =
      peerUserId || outgoingCall?.callee?._id || incomingCall?.callerInfo?.id;

    if (!silent && isCallActive && socket && targetId) {
      socket.emit("video:end", {
        to: targetId,
        roomId: currentRoomId,
      });
    }

    set({ ...initialState });
  },
}));