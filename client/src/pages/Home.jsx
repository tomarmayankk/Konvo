import Sidebar from "../components/Sidebar";

import ChatContainer from "../components/ChatContainer";
import Navbar from "../components/Navbar";
import useChatStore from "../store/useChatStore";
import ProfilePage from "./ProfilePage";


export default function Home() {
    const { activeTab } =
  useChatStore();
  return (
<div className="flex h-screen">
  <Navbar />

  {activeTab === "chat" ? (
    <>
      <Sidebar />
      <ChatContainer />
    </>
  ) : (
    <ProfilePage />
  )}
</div>
  );
}