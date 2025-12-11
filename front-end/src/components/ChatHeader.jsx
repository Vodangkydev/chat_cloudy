import React from 'react'
import {useAuthStore} from "../store/useAuthStore"
import {useChatStore} from "../store/useChatStore"
import {useVideoCallStore} from "../store/useVideoCallStore"
import { X, Video } from "lucide-react";
const ChatHeader = () => {
  const {selectedUser, setSelectedUser} = useChatStore();
  const {onlineUsers, socket} = useAuthStore();
  const { initiateCall } = useVideoCallStore();

  const handleVideoCall = async () => {
    if (!selectedUser || !socket) return;
    await initiateCall(selectedUser);
  }; 
    return (
    <div className="p-2.5 border-b border-base-300">
     <div className= "flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className ="avatar">
        <div className = " size-10 rounded-full">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />    
        </div>
    </div>
    <div>
        <h3 className='font-medium'>{selectedUser.fullName}</h3>
        <p className="flex items-center gap-2 text-sm text-base-content/70">
  {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
  {onlineUsers.includes(selectedUser._id) && (
    <span className="w-2 h-2 bg-green-500 rounded-full ml-0 relative top-0.5"></span>
  )}
</p>
        
    </div>
     </div>
     <div className="flex items-center gap-2">
      <button
        onClick={handleVideoCall}
        className="p-2 hover:bg-base-300 rounded-full transition"
        title="Video call"
      >
        <Video className="w-5 h-5" />
      </button>
      <button onClick={() => setSelectedUser(null)}>
        <X />
      </button>
     </div>
      
      </div>   
    </div>
  );
};

export default ChatHeader