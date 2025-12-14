# 💬 Chat App

Ứng dụng chat real-time với video call được xây dựng bằng React và Node.js.
<img width="626" height="620" alt="Image" src="https://github.com/user-attachments/assets/96c5ae84-59f4-4ecb-b593-bdb320de2866" />

<img width="631" height="686" alt="Image" src="https://github.com/user-attachments/assets/7ea907f1-15f9-4970-99c3-f3c718c22785" />

## ✨ Tính năng

- 🔐 **Xác thực người dùng**: Đăng ký và đăng nhập với JWT
- 💬 **Chat real-time**: Gửi và nhận tin nhắn text theo thời gian thực
- 🖼️ **Gửi hình ảnh**: Chia sẻ hình ảnh trong cuộc trò chuyện
- 📹 **Video call**: Gọi video nhóm với ZegoCloud
- 👥 **Trạng thái online/offline**: Hiển thị người dùng đang online
- 🎨 **Giao diện đẹp mắt**: UI hiện đại với TailwindCSS và DaisyUI
- 🌓 **Chế độ sáng/tối**: Chuyển đổi theme
- 😊 **Emoji picker**: Chọn và gửi emoji
- 🔔 **Thông báo**: Nhận thông báo khi có tin nhắn mới
- 👤 **Quản lý profile**: Cập nhật thông tin và ảnh đại diện

## 🛠️ Công nghệ sử dụng

### Frontend
- **React 19** - Thư viện UI
- **Vite** - Build tool và dev server
- **React Router DOM** - Điều hướng
- **Zustand** - State management
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client
- **TailwindCSS** - CSS framework
- **DaisyUI** - Component library
- **ZegoCloud UIKit** - Video calling SDK
- **Emoji Picker React** - Emoji picker component
- **React Hot Toast** - Notifications
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **MongoDB** - Database (với Mongoose)
- **Socket.io** - Real-time bidirectional communication
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Redis** - Caching (optional)
- **Cookie Parser** - Cookie handling
- **CORS** - Cross-origin resource sharing

## 📁 Cấu trúc dự án

```
Chat-App/
├── front-end/                 # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChatContainer.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCall.jsx
│   │   │   └── ...
│   │   ├── pages/             # Page components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignUpPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── store/             # Zustand stores
│   │   │   ├── useAuthStore.js
│   │   │   ├── useChatStore.js
│   │   │   ├── useVideoCallStore.js
│   │   │   └── ...
│   │   ├── lib/               # Utilities
│   │   │   └── axios.js
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── back-end/                  # Node.js backend application
│   ├── src/
│   │   ├── controllers/       # Route controllers
│   │   │   ├── auth.controllers.js
│   │   │   └── message.controller.js
│   │   ├── models/            # MongoDB models
│   │   │   ├── user.model.js
│   │   │   └── message.model.js
│   │   ├── routes/            # API routes
│   │   │   ├── auth.route.js
│   │   │   ├── message.route.js
│   │   │   └── video.route.js
│   │   ├── middleware/        # Express middleware
│   │   │   └── auth.middleware.js
│   │   ├── lib/               # Utilities
│   │   │   ├── db.js
│   │   │   ├── socket.js
│   │   │   ├── cloudinary.js
│   │   │   └── utils.js
│   │   └── index.js           # Entry point
│   └── package.json
│
└── package.json               # Root package.json
```

## 💻 Yêu cầu hệ thống

- **Node.js** >= 18.x
- **npm** >= 9.x hoặc **yarn**
- **MongoDB** (local hoặc MongoDB Atlas)
- **Redis** (optional, cho caching)
- Tài khoản **ZegoCloud** (cho video call)
- Tài khoản **Cloudinary** (cho lưu trữ hình ảnh)



### Authentication

- `POST /api/auth/signup` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại

### Messages

- `GET /api/messages/users` - Lấy danh sách người dùng
- `GET /api/messages/:userId` - Lấy tin nhắn với người dùng cụ thể
- `POST /api/messages/send/:receiverId` - Gửi tin nhắn

### Video

- `GET /api/video/config` - Lấy cấu hình ZegoCloud

## 🔌 Socket.io Events

### Client → Server

- `newMessage` - Gửi tin nhắn mới
- `join` - Tham gia phòng chat
- `disconnect` - Ngắt kết nối

### Server → Client

- `newMessage` - Nhận tin nhắn mới
- `getOnlineUsers` - Nhận danh sách người dùng online
- `videoCall` - Nhận yêu cầu video call
- `videoCallAccepted` - Video call được chấp nhận
- `videoCallRejected` - Video call bị từ chối
- `videoCallEnded` - Video call kết thúc

## 🎨 Tính năng UI

- **Responsive Design**: Tương thích với mobile và desktop
- **Dark/Light Mode**: Chuyển đổi theme
- **Real-time Updates**: Cập nhật tin nhắn và trạng thái online theo thời gian thực
- **Image Preview**: Xem trước hình ảnh trước khi gửi
- **Emoji Support**: Chọn và gửi emoji dễ dàng
- **Video Call Overlay**: Giao diện video call đẹp mắt


Võ Đăng Kỷ

---

**Lưu ý**: Đây là dự án học tập. Đảm bảo cấu hình đúng các biến môi trường trước khi chạy ứng dụng.

