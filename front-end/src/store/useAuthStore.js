import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import io from "socket.io-client"
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isSigningUp: false,
    isUpdatingProfile: false,
    isCheckingAuth: true, 
    onlineUsers: [], 
    socket: null,
    checkAuth: async () => {
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ authUser: res.data });
        get().connectSocket();
      } catch (error) {
        console.log("Error in checkAuth:", error);
        if (error.response?.status === 401) {
          set({ authUser: null });
        }
      } finally {
        set({ isCheckingAuth: false });
      }
    },
    signup: async (data) => {
      
      set({ isSigningUp: true });
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Tài khoản đã tạo thành công");
        get().connectSocket();
      } catch (error) {
        const message = error.response?.data?.message || "Đăng ký thất bại";
        toast.error(message);
      } finally {
        set({ isSigningUp: false });
      }
    },
    login: async (data) => {
      set({ isLoggingIn: true });
      try {
        const res = await axiosInstance.post("/auth/login", data);
        set({ authUser: res.data });
        toast.success("Đăng nhập thành công");
  
        get().connectSocket();
      } catch (error) {
        const message = error.response?.data?.message || "Đăng nhập thất bại";
        toast.error(message);
      } finally {
        set({ isLoggingIn: false });
      }
    },
  
    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Đăng xuất thành công");
        get().disconnectSocket();
      } catch (error) {
        const message = error.response?.data?.message || "Đăng xuất thất bại";
        toast.error(message);
      }
    },
    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });
      try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Cập nhật ảnh đại diện thành công");
      } catch (error) {
        console.log("error in update profile:", error);
        toast.error(error.response?.data?.message || "Có lỗi xảy ra khi cập nhật profile");
      } finally {
        set({ isUpdatingProfile: false });
      }
    },
    connectSocket: () => {
      const { authUser } = get();
      if (!authUser || get().socket?.connected) return;
      const socket = io(BASE_URL, {
        query: {
          userId: authUser._id,
        },
      });
      socket.connect();
      set({ socket: socket });
      socket.on("getOnlineUsers", (userIds) => {
        set({ onlineUsers: userIds });
      });
    },
    disconnectSocket: () => {
      if (get().socket?.connected) get().socket.disconnect();
    },
    
}));