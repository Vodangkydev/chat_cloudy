import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";
import { useChatStore } from "./useChatStore";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  subToNotifications: () => {
    const socket = useAuthStore.getState().socket;
    const { authUser } = useAuthStore.getState();
    if (!socket || !authUser) return;
    
    socket.on("newMessage", (newMessage) => {
      const { selectedUser } = useChatStore.getState();
      const { notifications } = get();
      const { users } = useChatStore.getState();
      const { authUser } = useAuthStore.getState();
      
      const isMyMessage = newMessage.senderId === authUser._id;
      const isFromSelectedUser = selectedUser && newMessage.senderId === selectedUser._id;
      
      if (isMyMessage || isFromSelectedUser) return;
      
      const sender = users.find(u => u._id === newMessage.senderId);
      const existingNotif = notifications.find(n => n.senderId === newMessage.senderId);
      
      if (!existingNotif && sender) {
        let messageText = newMessage.text;
        if (!messageText && newMessage.image) {
          messageText = "Đã gửi hình ảnh";
        } else if (!messageText) {
          messageText = "Đã gửi tin nhắn";
        }
        
        set({
          notifications: [...notifications, {
            senderId: newMessage.senderId,
            senderName: sender.fullName,
            senderPic: sender.profilePic,
            message: messageText,
            timestamp: newMessage.createdAt
          }]
        });
      }
    });
  },
  
  removeNotification: (senderId) => {
    const { notifications } = get();
    set({ notifications: notifications.filter(n => n.senderId !== senderId) });
  },
  
  clearNotificationBySender: (senderId) => {
    const { notifications } = get();
    set({ notifications: notifications.filter(n => n.senderId !== senderId) });
  },
}));






