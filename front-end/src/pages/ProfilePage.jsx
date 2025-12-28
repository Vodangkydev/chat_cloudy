import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();

  const [selectedImg, setSelectedImg] = useState(null);
  const [fullName, setFullName] = useState(authUser?.fullName || "");

  // kiểm tra có thay đổi hay chưa
  const isChanged =
    fullName !== authUser?.fullName || selectedImg !== null;

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateProfile({
      fullName,
      profilePic: selectedImg || authUser?.profilePic,
    });
    setSelectedImg(null);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">

          <div className="text-center">
            <h1 className="text-2xl font-semibold">Hồ sơ</h1>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImg || authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4"
              />

              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content p-2 rounded-full cursor-pointer transition
                ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <p className="text-sm text-zinc-400">
              {isUpdatingProfile
                ? "Đang tải..."
                : "Nhấp vào biểu tượng máy ảnh để cập nhật avatar"}
            </p>
          </div>

          {/* Họ tên */}
          <div>
            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <User className="w-4 h-4" />
              Họ và tên
            </div>
            <input
              className="px-4 py-2.5 bg-base-200 rounded-lg border w-full outline-none"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isUpdatingProfile}
            />
          </div>

          {/* Email */}
          <div>
            <div className="text-sm text-zinc-400 flex items-center gap-2 mb-1">
              <Mail className="w-4 h-4" />
              Email
            </div>
            <p className="px-4 py-2.5 bg-base-200 rounded-lg border">
              {authUser?.email}
            </p>
          </div>

          {/* Thông tin thêm */}
          <div className="bg-base-300 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin người dùng</h2>
            <div className="flex justify-between text-sm border-b border-zinc-700 py-2">
              <span>Ngày tạo</span>
              <span>
                {authUser?.createdAt
                  ? new Date(authUser.createdAt).toLocaleDateString("vi-VN")
                  : "--"}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end mt-8">
            <button
              className={`py-2 px-6 rounded text-white transition
                ${isChanged
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-600/40 cursor-not-allowed"}
              `}
              onClick={handleSave}
              disabled={!isChanged || isUpdatingProfile}
            >
              Lưu
            </button>

            <button
              className="bg-zinc-500 hover:bg-zinc-700 text-white py-2 px-6 rounded"
              onClick={handleCancel}
              disabled={isUpdatingProfile}
            >
              Hủy
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
