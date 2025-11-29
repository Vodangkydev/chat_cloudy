import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useNotificationStore } from "../store/useNotificationStore";

const NotificationIcon = () => {
  const { notifications, removeNotification } = useNotificationStore();
  const { setSelectedUser, users, getUsers } = useChatStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    const sender = users.find(u => u._id === notification.senderId);
    if (sender) {
      setSelectedUser(sender);
      removeNotification(notification.senderId);
      setIsOpen(false);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative btn btn-sm btn-ghost"
      >
        <Bell className="size-5 text-red-500" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center">
            {notifications.length > 9 ? "9+" : notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-zinc-500">
              Không có thông báo
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notif) => (
                <button
                  key={notif.senderId}
                  onClick={() => handleNotificationClick(notif)}
                  className="w-full p-3 flex items-start gap-3 hover:bg-base-300 transition-colors text-left"
                >
                  <img
                    src={notif.senderPic || "/avatar.png"}
                    alt={notif.senderName}
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{notif.senderName}</div>
                    <div className="text-sm text-zinc-400 truncate">{notif.message}</div>
                    <div className="text-xs text-zinc-500 mt-1">{formatTime(notif.timestamp)}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;

