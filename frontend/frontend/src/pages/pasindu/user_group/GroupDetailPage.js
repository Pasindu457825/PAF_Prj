import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const userObj = JSON.parse(storedUser);
      setUser(userObj);
      loadGroupAndUsers(userObj);
    }
  }, [navigate]);

  const loadGroupAndUsers = async (currentUser) => {
    try {
      const groupRes = await axios.get(
        `http://localhost:8080/api/groups/${groupId}`
      );
      setGroup(groupRes.data);

      const usersRes = await axios.get("http://localhost:8080/api/users");
      setAllUsers(usersRes.data);

      const memberList = usersRes.data.filter((u) =>
        groupRes.data.memberIds.includes(u.email)
      );

      setMembers(memberList);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load group or users:", err);
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedUserId) return alert("Select a user to add");

    try {
      await axios.post(
        `http://localhost:8080/api/groups/${groupId}/add-member`,
        {},
        {
          params: {
            userId: selectedUserId,
            actingUserEmail: user.email,
          },
        }
      );

      setMessage("✅ Member added successfully");
      setSelectedUserId("");
      loadGroupAndUsers(user);
    } catch (err) {
      console.error("Failed to add member:", err);
      setMessage("❌ Failed to add member");
    }
  };

  const handleRemoveMember = async (userEmailToRemove) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/groups/${groupId}/remove-member`,
        {
          params: {
            userId: userEmailToRemove,
            actingUserEmail: user.email,
          },
        }
      );
      setMessage("🗑️ Member removed");
      loadGroupAndUsers(user);
    } catch (err) {
      console.error("Failed to remove member:", err);
      setMessage("❌ Failed to remove member");
    }
  };

  if (loading) return <p className="p-4 text-center">Loading group...</p>;
  if (!group) return <p className="p-4 text-red-600">Group not found ❌</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to Groups
        </button>

        <h2 className="text-2xl font-bold mb-2">{group.name}</h2>
        <p className="text-gray-600 mb-4">{group.description}</p>

        {/* Add Member */}
        {user?.email === group.createdBy && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">➕ Add Member</h3>
            <select
              className="w-full p-2 border rounded mb-2"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">-- Select a user --</option>
              {allUsers
                .filter((u) => !group.memberIds.includes(u.email))
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username} ({user.email})
                  </option>
                ))}
            </select>
            <button
              onClick={handleAddMember}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              ➕ Add to Group
            </button>
            {message && (
              <p
                className={`mt-2 text-sm text-center font-medium ${
                  message.includes("✅") || message.includes("🗑️")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        )}

        {/* Member List */}
        <h3 className="text-lg font-semibold mb-2">👥 Members</h3>
        {members.length === 0 ? (
          <p className="text-gray-500">No members in this group.</p>
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <li
                key={member.id}
                className="p-3 border rounded bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {member.username}
                    {member.email === group.createdBy && (
                      <span className="ml-2 bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                        Admin
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>

                {/* Remove Button (only visible to admin, and can't remove self) */}
                {user?.email === group.createdBy &&
                  member.email !== group.createdBy && (
                    <button
                      onClick={() => handleRemoveMember(member.email)}
                      className="mt-2 sm:mt-0 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Remove
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

export default GroupDetailPage;
