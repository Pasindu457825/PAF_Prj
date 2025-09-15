import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifications,
  markAsRead,
  saveNotificationToLocalStorage,
} from "./NotificationService";
import { ChevronLeft } from "lucide-react"; // ✅ Icon import

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
    saveNotificationToLocalStorage(notification);
    navigate(`/post/${notification.postId}`);
  };

  return (
    <div className="min-h-screen bg-blue-100 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6">

        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ChevronLeft size={20} className="mr-2" />
          Back
        </button>

        <h1 className="text-3xl font-bold mb-6 text-blue-800">
          🔔 Notifications
        </h1>

        {loading && <p className="text-gray-600">Loading notifications...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet</p>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`p-4 rounded-lg cursor-pointer transition-all shadow-sm hover:shadow-md ${
                  notification.isRead
                    ? "bg-gray-100"
                    : "bg-blue-50 border-l-4 border-blue-500"
                }`}
              >
                <p className="font-medium text-gray-800">
                  {notification.message}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;
