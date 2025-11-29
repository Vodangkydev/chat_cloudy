import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useVideoCallStore = create((set, get) => ({
  isCallActive: false,
  zegoEngine: null,
  localStream: null,
  token: null,
  appId: null,
  appSign: null,
  roomId: null,
  isIncomingCall: false,
  callerInfo: null,
  isCalling: false,
  isCaller: false,

  startCall: async (roomId) => {
    try {
      const res = await axiosInstance.post("/video/token", { roomId });
      set({ 
        token: res.data.token, 
        appId: res.data.appId, 
        appSign: res.data.appSign,
        roomId 
      });
      return { token: res.data.token, appId: res.data.appId, appSign: res.data.appSign };
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

  endCall: () => {
    const { zegoEngine, localStream, roomId } = get();
    localStream?.getTracks().forEach((track) => track.stop());
    zegoEngine?.logoutRoom();
    const socket = useAuthStore?.getState()?.socket;
    const { selectedUser } = useChatStore?.getState() || {};
    if (socket && roomId && selectedUser) {
      socket.emit("video:end", { to: selectedUser._id, roomId });
    }
    set({
      isCallActive: false,
      zegoEngine: null,
      localStream: null,
      token: null,
      appId: null,
      appSign: null,
      roomId: null,
      isIncomingCall: false,
      callerInfo: null,
      isCalling: false,
      isCaller: false,
    });
  },
}));

