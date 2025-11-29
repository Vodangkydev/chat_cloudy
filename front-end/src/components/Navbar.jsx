import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Settings, ChevronDown } from "lucide-react";
import logo from "../assets/cloud.png";
import NotificationIcon from "./NotificationIcon";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div>
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>
              <h1 className="text-lg font-bold">Cloudy</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {authUser && <NotificationIcon />}

            {authUser && (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex gap-2 items-center btn btn-sm hover:bg-base-200 transition-colors"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className="hidden sm:inline">{authUser.fullName || "Người dùng"}</span>
                  <span className="sm:hidden">{authUser.fullName?.charAt(0) || "U"}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-200 rounded-lg shadow-lg border border-base-300 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-base-300">
                      <p className="text-sm font-medium">{authUser.fullName || "Người dùng"}</p>
                      <p className="text-xs text-base-content/60">{authUser.email}</p>
                    </div>
                    <Link
                      to={"/settings"}
                      className="w-full flex gap-2 items-center px-4 py-3 hover:bg-base-300 transition-colors text-left"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Cài đặt</span>
                    </Link>
                    <button
                      className="w-full flex gap-2 items-center px-4 py-3 hover:bg-base-300 transition-colors text-left"
                      onClick={() => {
                        logout();
                        setIsDropdownOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;