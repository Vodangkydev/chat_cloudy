import React, { useEffect } from 'react'
import {useAuthStore} from "../store/useAuthStore"
import {useChatStore} from "../store/useChatStore"
import {useVideoCallStore} from "../store/useVideoCallStore"
import { X, Video } from "lucide-react";
const ChatHeader = () => {
  const {selectedUser, setSelectedUser} = useChatStore();
  const {onlineUsers, authUser, socket} = useAuthStore();
  const {startCall, setCallActive, setRoomId, setIsCalling, setIsCaller, roomId} = useVideoCallStore();

  useEffect(() => {
    if (!socket || !roomId) return;
    const handleCallAccepted = async ({ roomId: acceptedRoomId }) => {
      if (acceptedRoomId === roomId) {
        await startCall(acceptedRoomId);
        setIsCaller(true);
        setCallActive(true);
        setIsCalling(false);
      }
    };
    const handleCallRejected = ({ roomId: rejectedRoomId }) => {
      if (rejectedRoomId === roomId) setIsCalling(false);
    };
    socket.on("video:accepted", handleCallAccepted);
    socket.on("video:rejected", handleCallRejected);
    return () => {
      socket.off("video:accepted", handleCallAccepted);
      socket.off("video:rejected", handleCallRejected);
    };
  }, [socket, roomId, startCall, setCallActive, setIsCalling, setIsCaller]);

  const handleVideoCall = async () => {
    if (!selectedUser || !socket) return;
    const roomId = `room_${[selectedUser._id, authUser._id].sort().join('_')}`;
    try {
      setIsCalling(true);
      socket.emit("video:call", {
        to: selectedUser._id,
        roomId,
        callerInfo: {
          _id: authUser._id,
          fullName: authUser.fullName,
          profilePic: authUser.profilePic,
        },
      });
      setRoomId(roomId);
    } catch (error) {
      console.error("Failed to start call:", error);
      setIsCalling(false);
    }
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