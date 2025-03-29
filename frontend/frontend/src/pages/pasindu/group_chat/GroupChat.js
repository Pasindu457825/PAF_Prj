import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const GroupChat = () => {
  const { groupId, groupName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    const res = await axios.get(
      `http://localhost:8080/api/messages/${groupId}`
    );
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    await axios.post("http://localhost:8080/api/messages", {
      groupId,
      groupName,
      senderEmail: user.email,
      content: text,
    });
    setText("");
    fetchMessages();
  };

  return (
    <div className="p-4 border rounded bg-white mt-4">
      <h3 className="text-lg font-semibold mb-2">💬 Group Chat</h3>
      <div className="h-64 overflow-y-scroll mb-2 border p-2 bg-gray-50 rounded flex flex-col space-y-3">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderEmail === user.email;

          const initials = msg.senderEmail
            ? msg.senderEmail
                .split("@")[0]
                .split(/[.\s_-]+/)
                .map((part) => part.charAt(0).toUpperCase())
                .slice(0, 2)
                .join("")
            : "U";

          return (
            <div
              key={index}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              {!isOwnMessage && (
                <div className="w-8 h-8 mr-2">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                      {initials}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg shadow text-sm ${
                  isOwnMessage
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                <div className="font-medium break-all">
                  {isOwnMessage ? "You" : msg.senderEmail}
                </div>
                <div className="text-gray-700">{msg.content}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex">
        <input
          className="flex-grow border rounded-l p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
