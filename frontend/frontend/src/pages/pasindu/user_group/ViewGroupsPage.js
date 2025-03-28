import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;
    const userObj = JSON.parse(storedUser);
    setUser(userObj);
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/groups");
      console.log(response.data); // Check the response structure in the console
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
    }
  };

  const handleJoinRequest = async (groupId) => {
    if (!user?.email) return alert("User not logged in");

    try {
      const response = await axios.post(
        `http://localhost:8080/api/groups/${groupId}/join`,
        null,
        {
          params: {
            userEmail: user.email,
          },
        }
      );

      alert("Joined the group successfully!");
      fetchGroups(); // refresh list to reflect change
    } catch (error) {
      alert(
        "Failed to join group: " + error.response?.data?.message ||
          error.message
      );
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4 text-center">🌐 All Groups</h2>

        {groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          <ul className="space-y-4">
            {groups.map((group) => (
              <li
                key={group.id}
                className="p-4 border rounded shadow-sm bg-white"
              >
                <h3 className="text-xl font-semibold">{group.name}</h3>

                <p className="text-sm mb-1">
                  <strong>Type:</strong>{" "}
                  {group.private ? (
                    <span className="text-purple-600">Private 🔒</span>
                  ) : (
                    <span className="text-blue-600">Public 🌐</span>
                  )}
                </p>

                <p className="text-sm text-gray-700">{group.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Created by: {group.createdBy}
                </p>

                {group.memberIds.includes(user?.email) ? (
                  <button
                    className="mt-2 px-4 py-1 bg-green-600 text-white rounded cursor-default"
                    disabled
                  >
                    Joined ✅
                  </button>
                ) : (
                  <button
                    onClick={() => handleJoinRequest(group.id)}
                    className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {group.private ? "Request to Join 🔒" : "Join Group"}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ViewGroupsPage;
