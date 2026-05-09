import {
  MessageSquare,
  Bell,
  User,
  LogOut,
} from "lucide-react";

import useAuthStore from "../store/useAuthStore";

import useChatStore from "../store/useChatStore";

import Notifications from "./Notifications";

export default function Navbar() {
  const { logout } =
    useAuthStore();

  const {
    friendRequests,

    toggleNotifications,

    activeTab,

    setActiveTab,
  } = useChatStore();

  return (
    <div className="w-[70px] h-screen border-r bg-white flex flex-col items-center py-5 justify-between relative">


      {/* TOP */}

      <div className="flex flex-col items-center gap-6">


        {/* LOGO */}

        <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold shadow-md">
          K
        </div>


        {/* CHAT */}

        <button
          onClick={() =>
            setActiveTab("chat")
          }
          className={`p-3 rounded-xl transition-all ${
            activeTab === "chat"
              ? "bg-black text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <MessageSquare size={24} />
        </button>


        {/* NOTIFICATIONS */}

        <div className="relative">

          <button
            onClick={toggleNotifications}
            className="p-3 rounded-xl hover:bg-gray-100 transition-all relative"
          >
            <Bell size={24} />

            {friendRequests.length >
              0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {
                  friendRequests.length
                }
              </div>
            )}
          </button>

          <Notifications />
        </div>


        {/* PROFILE */}

        <button
          onClick={() =>
            setActiveTab("profile")
          }
          className={`p-3 rounded-xl transition-all ${
            activeTab ===
            "profile"
              ? "bg-black text-white"
              : "hover:bg-gray-100"
          }`}
        >
          <User size={24} />
        </button>
      </div>


      {/* LOGOUT */}

      <button
        onClick={logout}
        className="p-3 rounded-xl hover:bg-red-100 hover:text-red-500 transition-all"
      >
        <LogOut size={24} />
      </button>
    </div>
  );
}