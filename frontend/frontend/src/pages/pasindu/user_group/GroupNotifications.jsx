import React, { useEffect, useState } from "react";
import { Bell, CheckCircle, XCircle, UserPlus, Users } from "lucide-react";

const GroupNotifications = () => {
  const [groups, setGroups] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user?.email) return;

    setAdminEmail(user.email);
    fetchPendingRequests(user.email);
  }, []);

  const fetchPendingRequests = async (email) => {
    setLoading(true);
    try {
      // This would use axios in your actual code
      const res = await fetch(
        `http://localhost:8080/api/groups/admin/${email}/pending-requests`
      );
      const data = await res.json();
      setGroups(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (groupId, userEmail) => {
    try {
      // This would use axios in your actual code
      await fetch(
        `http://localhost:8080/api/groups/${groupId}/approve-request?userEmail=${userEmail}&adminEmail=${adminEmail}`,
        {
          method: "POST",
        }
      );

      // Update UI optimistically
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              pendingRequests: group.pendingRequests.filter(
                (email) => email !== userEmail
              ),
            };
          }
          return group;
        })
      );

      // Show toast notification instead of alert
      showToast("Request approved successfully", "success");

      // Refresh data
      fetchPendingRequests(adminEmail);
    } catch (err) {
      showToast("Approval failed", "error");
    }
  };

  const handleReject = async (groupId, userEmail) => {
    try {
      // This would use axios in your actual code
      await fetch(
        `http://localhost:8080/api/groups/${groupId}/reject-request?userEmail=${userEmail}&adminEmail=${adminEmail}`,
        {
          method: "POST",
        }
      );

      // Update UI optimistically
      setGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              pendingRequests: group.pendingRequests.filter(
                (email) => email !== userEmail
              ),
            };
          }
          return group;
        })
      );

      // Show toast notification
      showToast("Request rejected", "info");

      // Refresh data
      fetchPendingRequests(adminEmail);
    } catch (err) {
      showToast("Rejection failed", "error");
    }
  };

  // Simple toast notification system
  const showToast = (message, type) => {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-4 py-2 rounded-lg text-white 
      ${
        type === "success"
          ? "bg-green-500"
          : type === "error"
          ? "bg-red-500"
          : "bg-blue-500"
      }
      shadow-lg transition-opacity duration-300 flex items-center`;

    const icon = document.createElement("span");
    icon.className = "mr-2 text-lg";
    icon.innerHTML = type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️";

    const text = document.createElement("span");
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  const generateAvatar = (email) => {
    // Create initials from email
    const initials = email.split("@")[0].substring(0, 2).toUpperCase();
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-yellow-500",
      "bg-teal-500",
    ];
    const colorIndex = email.charCodeAt(0) % colors.length;

    return (
      <div
        className={`${colors[colorIndex]} text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm`}
      >
        {initials}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-2">
          <Bell className="text-white mr-2" size={24} />
          <h2 className="text-2xl font-bold text-white">Group Join Requests</h2>
        </div>
        <p className="text-center text-white opacity-80">
          Manage pending requests from users who want to join your groups
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Bell className="text-gray-400" size={48} />
          </div>
          <p className="text-lg text-gray-500">
            No pending requests at this time
          </p>
          <p className="text-sm text-gray-400 mt-2">
            When users request to join your groups, they'll appear here
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((group) => (
            <div
              key={group.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg"
            >
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b flex items-center">
                <Users className="text-blue-500 mr-3" size={20} />
                <h3 className="text-xl font-semibold text-gray-800">
                  {group.name}
                </h3>
                <div className="ml-auto bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-xs font-medium flex items-center">
                  <UserPlus size={14} className="mr-1" />
                  {group.pendingRequests.length}{" "}
                  {group.pendingRequests.length === 1 ? "Request" : "Requests"}
                </div>
              </div>

              <div className="divide-y divide-gray-100">
                {group.pendingRequests.map((email) => (
                  <div
                    key={email}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-center">
                      {generateAvatar(email)}
                      <span className="ml-3 font-medium text-gray-700">
                        {email}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="flex items-center px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors duration-150"
                        onClick={() => handleApprove(group.id, email)}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </button>
                      <button
                        className="flex items-center px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors duration-150"
                        onClick={() => handleReject(group.id, email)}
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupNotifications;
