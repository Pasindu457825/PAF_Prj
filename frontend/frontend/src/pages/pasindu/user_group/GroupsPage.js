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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          👥 My Groups
        </h2>

        {/* ➕ Create Group Form */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Create a New Group</h3>
          <input
            type="text"
            name="name"
            placeholder="Group Name"
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-md mb-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description (optional)"
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup({ ...newGroup, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-md mb-2"
          ></textarea>

          {/* ✅ Private checkbox */}
          <label className="flex items-center space-x-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={newGroup.isPrivate}
              onChange={(e) =>
                setNewGroup({ ...newGroup, isPrivate: e.target.checked })
              }
            />
            <span>Make this group private 🔒</span>
          </label>

          <button
            type="button"
            onClick={handleCreateGroup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            ➕ Create Group
          </button>
        </div>

        {/* ✅ Message */}
        {message && (
          <p
            className={`text-center font-medium mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* 🔔 Notification Button for Join Requests */}
        <div className="mb-4 text-center">
          <button
            onClick={() => navigate("/notifications")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
          >
            🔔 View Join Requests
          </button>
        </div>

        {/* 📋 Group List */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Your Groups</h3>
          {groups.length === 0 ? (
            <p className="text-gray-500">You are not in any groups yet.</p>
          ) : (
            <ul className="space-y-3">
              {groups.map((group) => (
                <li
                  key={group.id}
                  onClick={() => navigate(`/groups/view/${group.id}`)}
                  className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md hover:bg-blue-50 transition cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-blue-700">
                    {group.name}
                    {group.isPrivate && (
                      <span className="ml-2 text-sm text-purple-600">🔒</span>
                    )}
                  </h4>
                  <p className="text-gray-600">{group.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Created by: {group.createdBy}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
