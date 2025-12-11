import { create } from "zustand";
import toast from "react-hot-toast";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

// Prefer env to avoid hardcoding secrets in the bundle
const ZEGO_APP_ID = Number(import.meta.env.VITE_ZEGO_APP_ID);
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET;

export const useVideoCallStore = create((set, get) => ({
  isCallActive: false,
  zegoEngine: null,
  localStream: null,
  token: null,
  kitToken: null,
  appId: null,
  appSign: null,
  roomId: null,
  isIncomingCall: false,
  callerInfo: null,
  isCalling: false,
  isCaller: false,
  hasSocketListeners: false,

  startCall: async (roomId) => {
    try {
      const { authUser } = useAuthStore.getState();
      if (!authUser?._id) {
        throw new Error("Người dùng chưa đăng nhập");
      }

      if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
        throw new Error("Thiếu thông tin cấu hình Zego (VITE_ZEGO_APP_ID / VITE_ZEGO_SERVER_SECRET)");
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        ZEGO_APP_ID,
        ZEGO_SERVER_SECRET,
        roomId,
        authUser._id,
        authUser.fullName || authUser._id
      );

      set({
        kitToken,
        roomId,
      });

      return { kitToken };
    } catch (error) {
      toast.error("Không thể khởi tạo cuộc gọi");
      throw error;
    }
  },

  setCallActive: (isActive) => set({ isCallActive: isActive }),
  setZegoEngine: (engine) => set({ zegoEngine: engine }),
  setLocalStream: (stream) => set({ localStream: stream }),
  setRoomId: (roomId) => set({ roomId }),
  setIncomingCall: (isIncoming, callerInfo = null, roomId = null) => 
    set({ isIncomingCall: isIncoming, callerInfo, roomId }),
  setIsCalling: (isCalling) => set({ isCalling }),
  setIsCaller: (isCaller) => set({ isCaller }),

  initiateCall: async (targetUser) => {
    const { authUser, socket } = useAuthStore.getState();
    if (!authUser || !socket || !targetUser?._id) return;

    const roomId = `room_${[targetUser._id, authUser._id].sort().join("_")}`;
    set({ isCalling: true, roomId, isCaller: true });

    socket.emit("video:call", {
      to: targetUser._id,
      roomId,
      callerInfo: {
        _id: authUser._id,
        fullName: authUser.fullName,
        profilePic: authUser.profilePic,
      },
    });
  },

  acceptIncomingCall: async () => {
    const { socket } = useAuthStore.getState();
    const { callerInfo, roomId, startCall } = get();
    if (!socket || !roomId || !callerInfo) return;

    try {
      await startCall(roomId);
      set({
        isCaller: false,
        isCallActive: true,
        isIncomingCall: false,
        callerInfo: null,
      });
      socket.emit("video:accept", { to: callerInfo._id, roomId });
      useChatStore.getState().setSelectedUser(callerInfo);
    } catch (error) {
      console.error("Failed to accept call:", error);
      toast.error("Không thể kết nối cuộc gọi");
    }
  },

  rejectIncomingCall: () => {
    const { socket } = useAuthStore.getState();
    const { callerInfo, roomId } = get();
    if (!socket || !roomId || !callerInfo) return;
    socket.emit("video:reject", { to: callerInfo._id, roomId });
    set({ isIncomingCall: false, callerInfo: null, roomId: null });
  },

  cancelOutgoingCall: () => {
    const { socket } = useAuthStore.getState();
    const { roomId } = get();
    const { selectedUser } = useChatStore.getState() || {};
    if (socket && roomId && selectedUser) {
      socket.emit("video:reject", { to: selectedUser._id, roomId });
    }
    set({ isCalling: false });
  },

  subscribeToSocketEvents: () => {
    const { socket } = useAuthStore.getState();
    if (!socket || get().hasSocketListeners) return () => {};

    const handleIncomingCall = ({ roomId, callerInfo }) => {
      set({
        isIncomingCall: true,
        callerInfo,
        roomId,
        isCalling: false,
        isCaller: false,
      });
    };

    const handleCallAccepted = async ({ roomId: acceptedRoomId }) => {
      const { roomId, startCall } = get();
      if (acceptedRoomId !== roomId) return;
      try {
        await startCall(acceptedRoomId);
        set({ isCaller: true, isCallActive: true, isCalling: false, isIncomingCall: false });
      } catch (error) {
        console.error("Failed to start call after accept:", error);
      }
    };

    const handleCallRejected = ({ roomId: rejectedRoomId }) => {
      const { roomId } = get();
      if (rejectedRoomId !== roomId) return;
      set({ isCalling: false, isIncomingCall: false, callerInfo: null });
      toast.error("Cuộc gọi đã bị từ chối");
    };

    const handleCallEnded = () => {
      const { isCallActive } = useVideoCallStore.getState();
      if (isCallActive) {
        useVideoCallStore.getState().endCall();
      } else {
        set({ isIncomingCall: false, callerInfo: null, isCalling: false });
      }
    };

    socket.on("video:incoming", handleIncomingCall);
    socket.on("video:accepted", handleCallAccepted);
    socket.on("video:rejected", handleCallRejected);
    socket.on("video:ended", handleCallEnded);

    set({ hasSocketListeners: true });

    return () => {
      socket.off("video:incoming", handleIncomingCall);
      socket.off("video:accepted", handleCallAccepted);
      socket.off("video:rejected", handleCallRejected);
      socket.off("video:ended", handleCallEnded);
      set({ hasSocketListeners: false });
    };
  },

  endCall: () => {
    const { zegoEngine, localStream, roomId } = get();
    localStream?.getTracks().forEach((track) => track.stop());
    zegoEngine?.destroy?.();
    const socket = useAuthStore?.getState()?.socket;
    const { selectedUser } = useChatStore?.getState() || {};
    if (socket && roomId && selectedUser) {
      socket.emit("video:end", { to: selectedUser._id, roomId });
    }
    set({
      isCallActive: false,
      zegoEngine: null,
      localStream: null,
      kitToken: null,
      roomId: null,
      isIncomingCall: false,
      callerInfo: null,
      isCalling: false,
      isCaller: false,
    });
  },
}));

