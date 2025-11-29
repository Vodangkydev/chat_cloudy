
import { MessageSquare } from "lucide-react";
import logo from "../assets/cloud.png";
const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="flex justify-center gap-4 mb-4">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center
             justify-center animate-bounce"
            >
              <div>
              <img src={logo} alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Chào mừng đã đến với Cloudy</h2>
        <p className="text-base-content/60">
          Chọn một cuộc trò chuyện để bắt đầu 
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
