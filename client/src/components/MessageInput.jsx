import { useState } from "react";

import useChatStore from "../store/useChatStore";

export default function MessageInput() {
  const [text, setText] = useState("");

  const { sendMessage } =
    useChatStore();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    await sendMessage(text);

    setText("");
  };

  return (
    <form
      onSubmit={handleSend}
      className="p-4 border-t bg-white"
    >
      <div className="flex items-center gap-3">
        
        {/* INPUT */}

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-5 py-3 outline-none focus:border-black transition-all"
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
        />


        {/* BUTTON */}

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-full hover:opacity-90 transition-all"
        >
          Send
        </button>
      </div>
    </form>
  );
}