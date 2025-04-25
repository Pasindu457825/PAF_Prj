import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotifications, markAsRead, saveNotificationToLocalStorage } from "./notificationService";

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
    // Mark as read
    if (!notification.isRead) {
      await markAsRead(notification.id);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
    // Save to local storage
    saveNotificationToLocalStorage(notification);
    // Navigate to post
    navigate(`/post/${notification.postId}`);
  };

  if (loading) return <div>Loading notifications...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      
      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                notification.isRead
                  ? "bg-white"
                  : "bg-blue-50 border-l-4 border-blue-500"
              } hover:bg-gray-100`}
            >
              <p className="font-medium">{notification.message}</p>
              <p className="text-sm text-gray-500">
                {new Date(notification.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationPage;