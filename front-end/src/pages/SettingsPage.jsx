import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";
import { User, Settings, Sun, Moon } from "lucide-react";

const SettingsPage = () => {
  const { authUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold flex items-center justify-center gap-2">
              <Settings className="w-6 h-6" />
              Cài đặt
            </h1>
          </div>

          {/* Profile Section */}
          <div className="bg-base-200 rounded-lg p-6 space-y-4">
           

            <div className="flex items-center gap-3">
              <img
                src={authUser?.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-16 rounded-full object-cover border-2 border-base-content/20"
              />
              <p className="font-medium">{authUser?.fullName}</p>
              <div className="flex items-center w-full">
              <Link to="/profile" className="btn btn-sm btn-primary ml-auto">
                 Xem hồ sơ
              </Link>
            </div>
            </div>
          </div>

          {/* Theme Section */}
          <div className="bg-base-200 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-medium flex items-center gap-2">
              {theme === "dark" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              Giao diện
            </h2>
            <div className="flex items-center justify-between">
              <span className="text-sm">Chế độ {theme === "dark" ? "Tối" : "Sáng"}</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;