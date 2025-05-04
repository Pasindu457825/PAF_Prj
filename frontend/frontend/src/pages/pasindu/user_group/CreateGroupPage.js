import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateGroupPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
    isPrivate: false,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleCreate = async () => {
    if (!user) return;

    try {
      const response = await axios.post("http://localhost:8080/api/groups", {
        name: groupData.name,
        description: groupData.description,
        creatorEmail: user.email,
        isPrivate: groupData.isPrivate,
      });

      setMessage("✅ Group created successfully");
      setTimeout(() => {
        navigate(`/groups/${user.id}`); // Go back to groups page
      }, 1500);
    } catch (err) {
      console.error("Failed to create group:", err);
      setMessage("❌ Failed to create group");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">
          ➕ Create New Group
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <input
          type="text"
          placeholder="Group Name"
          value={groupData.name}
          onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
          className="w-full border px-4 py-2 mb-3 rounded"
        />
        <textarea
          placeholder="Description"
          value={groupData.description}
          onChange={(e) =>
            setGroupData({ ...groupData, description: e.target.value })
          }
          className="w-full border px-4 py-2 mb-3 rounded"
        ></textarea>

        <label className="flex items-center text-sm space-x-2 mb-4">
          <input
            type="checkbox"
            checked={groupData.isPrivate}
            onChange={(e) =>
              setGroupData({ ...groupData, isPrivate: e.target.checked })
            }
          />
          <span>Make this group private 🔒</span>
        </label>

        <button
          onClick={handleCreate}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          ✅ Create Group
        </button>

        <button
          onClick={() => navigate(`/groups/${user?.id}`)}
          className="w-full mt-2 border text-gray-600 py-2 rounded-md hover:bg-gray-100"
        >
          🔙 Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateGroupPage;
