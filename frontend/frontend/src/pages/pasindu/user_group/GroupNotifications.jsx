import React, { useEffect, useState } from "react";
import axios from "axios";

const GroupNotifications = () => {
  const [groups, setGroups] = useState([]);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user?.email) return;

    setAdminEmail(user.email);
    fetchPendingRequests(user.email);
  }, []);

  const fetchPendingRequests = async (email) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/groups/admin/${email}/pending-requests`
      );
      setGroups(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">🔔 Join Requests</h2>
      {groups.length === 0 ? (
        <p className="text-center text-gray-600">No pending requests.</p>
      ) : (
        groups.map((group) => (
          <div key={group.id} className="bg-white p-4 mb-4 rounded shadow">
            <h3 className="text-xl font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-500">Pending Join Requests:</p>
            <ul className="mt-2 list-disc list-inside">
              {group.pendingRequests.map((email) => (
                <li key={email} className="flex items-center justify-between">
                  {email}
                  <div className="space-x-2">
                    <button
                      className="px-2 py-1 bg-green-500 text-white rounded"
                      onClick={() => handleApprove(group.id, email)}
                    >
                      Approve
                    </button>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => handleReject(group.id, email)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );

  async function handleApprove(groupId, userEmail) {
    try {
      await axios.post(
        `http://localhost:8080/api/groups/${groupId}/add-member`,
        null,
        {
          params: {
            userId: userEmail,
            actingUserEmail: adminEmail,
          },
        }
      );

      alert("User approved and added.");
      fetchPendingRequests(adminEmail);
    } catch (err) {
      alert("Approval failed: " + err.message);
    }
  }

  async function handleReject(groupId, userEmail) {
    try {
      await axios.post(
        `http://localhost:8080/api/groups/${groupId}/reject-request`,
        null,
        {
          params: {
            userEmail: userEmail,
            adminEmail: adminEmail,
          },
        }
      );

      alert("Request rejected.");
      fetchPendingRequests(adminEmail);
    } catch (err) {
      alert("Rejection failed: " + err.message);
    }
  }
};

export default GroupNotifications;
