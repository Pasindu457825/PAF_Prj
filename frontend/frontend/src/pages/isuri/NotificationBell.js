import React, { useEffect, useState } from 'react';
import axios from '../../axiosConfig';

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`/api/notifications/${userId}`);
        setNotifications(res.data || []);
      } catch (error) {
        console.error('Notification fetch error', error);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <div className="relative">
      <span className="text-xl">🔔</span>
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 rounded-full">
          {notifications.length}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;
