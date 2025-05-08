import axiosInstance from "./axiosConfig";

export const getNotifications = async () => {
  const response = await axiosInstance.get("/notifications", {
    withCredentials: true,
  });
  return response.data;
};

export const getUnreadCount = async () => {
  const response = await axiosInstance.get("/notifications/unread-count", {
    withCredentials: true,
  });
  return response.data;
};

export const markAsRead = async (notificationId) => {
  const response = await axiosInstance.put(
    `/notifications/${notificationId}/mark-as-read`,
    null,
    { withCredentials: true }
  );
  return response.data;
};

export const saveNotificationToLocalStorage = (notification) => {
  const notifications = JSON.parse(localStorage.getItem("notifications")) || [];
  notifications.push(notification);
  localStorage.setItem("notifications", JSON.stringify(notifications));
};
