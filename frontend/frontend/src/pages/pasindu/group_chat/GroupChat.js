import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { storage } from "../../../firebase/FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ArrowDownCircle, ImageIcon, Send, X } from "lucide-react";

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
        `http://localhost:8080/api/messages/${groupId}`,
        {
          params: { userEmail: user.email }, // ✅ send user email if required
        }
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

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    <div className="relative bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">💬</span> {groupName || "Group Chat"}
        </h3>
        <p className="text-blue-100 text-sm mt-1">Group ID: {groupId}</p>
      </div>

      {/* Messages Area */}
      <div
        ref={messageContainerRef}
        onScroll={handleScroll}
        className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col space-y-4"
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
              } animate-fade-in-up`}
              style={{
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "backwards",
              }}
            >
              {!isOwnMessage && (
                <div className="flex-shrink-0 mr-2">
                  {msg.profileImage ? (
                    <img
                      src={msg.profileImage}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold shadow-md"
                      style={{
                        backgroundColor: `hsl(${
                          msg.senderName.length * 20
                        }, 70%, 50%)`,
                      }}
                    >
                      {initials}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`max-w-xs sm:max-w-sm md:max-w-md rounded-2xl shadow-sm px-4 py-3 ${
                  isOwnMessage
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div
                  className={`font-medium text-sm ${
                    isOwnMessage ? "text-blue-100" : "text-gray-500"
                  }`}
                >
                  {isOwnMessage ? "You" : msg.senderName || msg.senderEmail}
                </div>
                {msg.content && (
                  <div
                    className={`${
                      isOwnMessage ? "text-white" : "text-gray-800"
                    } mt-1`}
                  >
                    {msg.content}
                  </div>
                )}
                {msg.image && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
                    <img
                      src={msg.image}
                      alt="media"
                      className="w-full max-h-64 object-cover"
                    />
                  </div>
                )}
                <div
                  className={`text-xs mt-1 ${
                    isOwnMessage ? "text-blue-200" : "text-gray-400"
                  } flex justify-end`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {isOwnMessage && (
                <div className="flex-shrink-0 ml-2">
                  <div className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold shadow-md">
                    {initials}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg transition-all transform hover:scale-110"
          aria-label="Scroll to bottom"
        >
          <ArrowDownCircle className="w-6 h-6" />
        </button>
      )}

      {/* Message Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {previewUrl && (
          <div className="mb-3 p-2 bg-gray-100 rounded-lg flex items-center">
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-md object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <span className="ml-3 text-sm text-gray-600 truncate flex-1">
              {imageFile?.name || "Selected image"}
            </span>
          </div>
        )}

        <div className="flex rounded-lg shadow-sm bg-gray-50 border overflow-hidden">
          <input
            type="text"
            className="flex-grow p-3 bg-transparent focus:outline-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />

          <div className="flex items-center px-2">
            <label
              htmlFor="file-upload"
              className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ImageIcon className="w-5 h-5 text-gray-500" />
              <input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageSelect}
                disabled={loading}
                className="hidden"
              />
            </label>

            <button
              className={`ml-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition-colors flex items-center justify-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={sendMessage}
              disabled={loading}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
