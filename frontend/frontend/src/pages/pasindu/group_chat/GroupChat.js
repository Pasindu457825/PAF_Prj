import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { storage } from "../../../firebase/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowDownCircleIcon } from "@heroicons/react/24/solid";

const GroupChat = () => {
  const { groupId, groupName } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messageContainerRef = useRef(null);
  const fileInputRef = useRef();
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/messages/${groupId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Fetch messages failed:", err);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToBottom = () => {
    const container = messageContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;
    const nearBottom =
      container.scrollHeight - container.scrollTop <=
      container.clientHeight + 100;
    setShowScrollButton(!nearBottom);
  };

  const sendMessage = async () => {
    if (!text.trim() && !imageFile) return;
    setLoading(true);

    try {
      let imageUrl = "";

      if (imageFile) {
        const imageRef = ref(
          storage,
          `chat-images/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }

      const messagePayload = {
        groupId,
        groupName,
        senderEmail: user.email,
        senderName: user.username,
        content: text || "",
        image: imageUrl || null,
      };

      await axios.post("http://localhost:8080/api/messages", messagePayload);

      setText("");
      setImageFile(null);
      setPreviewUrl("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchMessages();
      scrollToBottom();
    } catch (err) {
      console.error("Send message failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative p-4 border rounded bg-white mt-4 max-w-4xl mx-auto">
      <h3 className="text-xl font-semibold mb-3">💬 Group Chat</h3>

      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-scroll mb-4 border p-3 bg-gray-50 rounded flex flex-col space-y-3 scroll-smooth"
      >
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderEmail === user.email;
          const initials = msg.senderName
            ? msg.senderName
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()
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
                  {msg.profileImage ? (
                    <img
                      src={msg.profileImage}
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
                className={`max-w-[75%] px-3 py-2 rounded-lg shadow text-sm ${
                  isOwnMessage
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                <div className="font-medium break-words">
                  {isOwnMessage ? "You" : msg.senderName || msg.senderEmail}
                </div>
                {msg.content && (
                  <div className="text-gray-700 break-words">{msg.content}</div>
                )}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="media"
                    className="mt-2 rounded max-w-[200px] border"
                  />
                )}
                <div className="text-[10px] text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition"
          title="Scroll to bottom"
        >
          <ArrowDownCircleIcon className="w-6 h-6" />
        </button>
      )}

      {previewUrl && (
        <div className="flex items-center space-x-2 mb-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-14 h-14 rounded border"
          />
          <span className="text-sm text-gray-600 truncate">
            {imageFile?.name}
          </span>
        </div>
      )}

      <div className="flex gap-2 items-center mt-2">
        <input
          type="text"
          className="flex-grow border rounded-l p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          disabled={loading}
          className="text-sm"
        />
        <button
          className={`bg-blue-600 text-white px-4 py-2 rounded ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={sendMessage}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default GroupChat;
