import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });

  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      fetchUserGroups(userObj.email);
    }
  }, [navigate]);

  const fetchUserGroups = async (userEmail) => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      const allGroups = response.data;
      const userGroups = allGroups.filter(
        (group) => group.createdBy === userEmail
      );
      setGroups(userGroups);
    } catch (err) {
      console.error("Failed to fetch groups:", err);
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !user.email) {
      return alert("User not loaded — please login again.");
    }

    try {
      const response = await axios.post("http://localhost:8080/api/groups", {
        name: newGroup.name,
        description: newGroup.description,
        creatorEmail: user.email,
        isPrivate: newGroup.isPrivate,
      });

      setGroups([...groups, response.data]);
      setNewGroup({ name: "", description: "", isPrivate: false });
      setMessage("✅ Group created successfully");
    } catch (err) {
      console.error("Group creation failed:", err);
      setMessage("❌ Failed to create group");
    }
  };

  return (
    <div className="min-h-screen bg-white py-10 px-6 relative">
      {/* Floating Create Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={() => navigate("/groups/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-sm text-sm font-medium transition"
        >
          ➕ New Group
        </button>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">My Groups</h2>

      {/* Message */}
      {message && (
        <div
          className={`text-center font-medium mb-6 px-4 py-2 rounded-md ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}

      {/* Join Requests */}
      <div className="mb-10 text-left">
        <button
          onClick={() => navigate("/notifications")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm transition"
        >
          🔔 View Join Requests
        </button>
      </div>

      {/* Group Cards */}
      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">
          You are not in any groups yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 min-w-[1200px]">
            {groups.map((group) => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/view/${group.id}`)}
                className="bg-white border rounded-xl shadow-sm hover:shadow-md transition h-[260px] p-4 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <h4 className="text-base font-semibold text-blue-700 mb-1 group-hover:underline">
                    {group.name}
                    {group.isPrivate && (
                      <span className="ml-2 text-sm text-purple-600">🔒</span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {group.description || "No description provided."}
                  </p>
                  <p className="text-xs text-gray-500">
                    Created by: <br />
                    {group.createdBy}
                  </p>
                </div>

                <div className="flex justify-between items-center text-sm mt-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevents card click
                      navigate(`/groups/chat/${group.id}`);
                    }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    💬 Chat
                  </button>

                  <button
                    onClick={async (e) => {
                      e.stopPropagation(); // prevents card click
                      const confirmed = window.confirm(
                        `Are you sure you want to delete "${group.name}"?`
                      );
                      if (!confirmed) return;

                      try {
                        await axios.delete(
                          `http://localhost:8080/api/groups/delete/${group.id}`,
                          { params: { userEmail: user.email } }
                        );
                        setGroups(groups.filter((g) => g.id !== group.id));
                        setMessage(`✅ "${group.name}" deleted`);
                      } catch (err) {
                        const msg =
                          err.response?.data?.message || "Delete failed.";
                        alert("Error: " + msg);
                      }
                    }}
                    className="text-red-500 hover:underline font-medium"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsPage;
