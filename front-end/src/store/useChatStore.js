import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios"
import { useAuthStore } from "./useAuthStore";
import { useNotificationStore } from "./useNotificationStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    onlineUsers: [],
    getUsers: async () => {
        set ({ isUsersLoading: true });
        try{
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data.filteredUsers || [] })
        } catch (error) {
            toast.error(error.response.data.message) 
        }finally {
            set({ isUsersLoading: false});
        }
    },
    getMessages : async (userId) => {
        set({ isMessagesLoading : true})
        try {
            const res = await axiosInstance.get(`messages/${userId}`);
            set({ messages: res.data.messages || []});
        }   catch (error) {
            toast.error(error.response.data.message);
        }   finally{
            set({ isMessagesLoading: false});
            }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
          const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
          set({ messages: [...messages, res.data] });
        } catch (error) {
          toast.error(error.response.data.message);
        }
      },
      subToMessages: () =>
        {
            const {selectedUser} = get()
            if(!selectedUser) return;
            const socket = useAuthStore.getState().socket;
            if (!socket) return;
            
            socket.on("newMessage", (newMessage) => {
                const {selectedUser} = get();
                if (!selectedUser) return;
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
                if (!isMessageSentFromSelectedUser) return;
                set({
                    messages: [...get().messages, newMessage],
            })
        });
        },
        unsubFromMessages: () => {
          },
    setSelectedUser: (selectedUser) => {
        set({ selectedUser });
        if (selectedUser) {
            useNotificationStore.getState().clearNotificationBySender(selectedUser._id);
        }
    },
    
}))