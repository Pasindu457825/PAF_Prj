import { deleteUserById } from "../pasindu/DeleteUser";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  FileText,
  Users,
  Bell,
  LogOut,
  Trash2,
  BookOpen,
  UserPlus,
  PenTool,
} from "lucide-react";
import { getUnreadCount } from "../isuri/Notification/NotificationService";
const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);
  
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const count = await getUnreadCount();
        setUnreadCount(count);
      } catch (err) {
        console.error("Failed to fetch unread count", err);
      }
    };
    fetchUnread();
  }, []);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await deleteUserById(user.id);
        sessionStorage.removeItem("user");
        navigate("/login");
      } catch (err) {
        console.error("Delete failed", err);
        alert("Failed to delete user ❌");
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Profile Info */}
        <div className="md:w-1/3 bg-gradient-to-b from-indigo-600 to-blue-700 text-white p-8">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-6">
              <img
                src={user.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-indigo-200 mb-1">@{user.username}</p>
            <div className="flex items-center mt-2 mb-6">
              <User size={16} className="mr-2" />
              <span className="text-sm text-indigo-100">{user.email}</span>
            </div>

            <button
              onClick={() => navigate(`/update-user/${user.id}`)}
              className="w-full flex items-center justify-center gap-2 bg-white text-indigo-700 py-2 px-4 rounded-lg font-medium hover:bg-indigo-50 transition-all mb-4"
            >
              <PenTool size={18} />
              Edit Profile
            </button>

            <div className="w-full h-px bg-indigo-400 my-6"></div>

            <div className="text-left w-full">
              <h3 className="uppercase text-xs font-semibold tracking-wider text-indigo-200 mb-4">
                Account Information
              </h3>
              <div className="text-sm space-y-2">
                <p className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2 text-indigo-100">{user.email}</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium">Username:</span>
                  <span className="ml-2 text-indigo-100">@{user.username}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="md:w-2/3 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Account Dashboard
          </h2>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {/* My Posts */}
            <div
              onClick={() => navigate("/myposts")}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText size={20} className="text-blue-600" />
                </div>
                <h3 className="ml-3 font-medium text-gray-800">My Posts</h3>
              </div>
              <p className="text-sm text-gray-500">
                View and manage all your posted content
              </p>
            </div>

            {/* My Groups */}
            <div
              onClick={() => navigate(`/groups/${user.id}`)}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Users size={20} className="text-purple-600" />
                </div>
                <h3 className="ml-3 font-medium text-gray-800">My Groups</h3>
              </div>
              <p className="text-sm text-gray-500">
                Access and manage your group memberships
              </p>
            </div>

            {/* Online Learning */}
            <div
              onClick={() => navigate("/courses")}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <BookOpen size={20} className="text-green-600" />
                </div>
                <h3 className="ml-3 font-medium text-gray-800">
                  Online Learning
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Access your courses and learning materials
              </p>
            </div>

            {/* Notifications */}
            <div
              onClick={() => navigate("/notificationsPage")}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md cursor-pointer transition-all"
            >
              <div className="flex items-center mb-3">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Bell size={20} className="text-yellow-600" />
                </div>
                <h3 className="ml-3 font-medium text-gray-800">
                  Notifications {unreadCount > 0 && `(${unreadCount})`}
                </h3>
              </div>
              <p className="text-sm text-gray-500">
                Check your latest updates and alerts
              </p>
            </div>
          </div>

          {/* Friend Management */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
  <h3 className="text-lg font-medium text-gray-800 mb-4">
    Friend Management
  </h3>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <button
      onClick={() => navigate("/followUsers")}
      className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all"
    >
      <Users size={18} />
      My Friends
    </button>
    <button
      onClick={() => navigate("/allUsers")}
      className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-100 transition-all"
    >
      <UserPlus size={18} />
      Add Friends
    </button>
  </div>
</div>
          {/* Account Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-all"
            >
              <LogOut size={18} />
              Logout
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all"
            >
              <Trash2 size={18} />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
