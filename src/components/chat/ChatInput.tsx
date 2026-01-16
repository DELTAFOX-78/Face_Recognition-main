import React, { useState } from "react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [content, setContent] = useState("");

  const handleSendMessage = () => {
    if (content.trim()) {
      onSendMessage(content);
      setContent("");
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="text"
        className="flex-1 p-2 border rounded-lg"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        disabled={disabled}
        placeholder="Type a message..."
      />
      <button
        className="ml-2 p-2 bg-blue-500 text-white rounded-lg"
        onClick={handleSendMessage}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
};

export default ChatInput;
