import { useEffect, useRef } from "react";

import useChatStore from "../store/useChatStore";

import useAuthStore from "../store/useAuthStore";

import Message from "./Message";

import MessageInput from "./MessageInput";

export default function ChatContainer() {
  const {
    selectedUser,
    messages,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
    isMessagesLoading,
  } = useChatStore();

  const { onlineUsers } =
    useAuthStore();

  const messageEndRef = useRef(null);


  // FETCH + SOCKET

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);

    subscribeToMessages();

    return () =>
      unsubscribeFromMessages();
  }, [selectedUser]);


  // AUTO SCROLL

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);


  // EMPTY STATE

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-400">
            Welcome to Konvo
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Select a conversation to start chatting
          </p>
        </div>
      </div>
    );
  }


  // LOADING

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-lg">
          Loading messages...
        </p>
      </div>
    );
  }

  const isOnline =
    onlineUsers.includes(
      selectedUser._id
    );

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">


      {/* HEADER */}

      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <div className="flex items-center gap-3">
          
          {/* AVATAR */}

          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
              {selectedUser.fullName[0]}
            </div>

            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>


          {/* USER INFO */}

          <div>
            <h1 className="text-xl font-bold">
              {selectedUser.fullName}
            </h1>

            <p className="text-sm text-gray-500">
              {isOnline
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
      </div>


      {/* MESSAGES */}

      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-lg">
              Start the conversation 👋
            </p>
          </div>
        )}

        {messages.map((message) => (
          <Message
            key={message._id}
            message={message}
          />
        ))}

        <div ref={messageEndRef} />
      </div>


      {/* INPUT */}

      <MessageInput />
    </div>
  );
}