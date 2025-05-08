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
      setMessage("Group created successfully");
    } catch (err) {
      console.error("Group creation failed:", err);
      setMessage("Failed to create group");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Groups</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate("/notifications")}
                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <span className="mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </span>
                Join Requests
              </button>
              <button
                onClick={() => navigate("/groups/create")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                New Group
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {message && (
          <div
            className={`mb-6 px-4 py-3 rounded-lg shadow-sm ${
              message.includes("success")
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex">
              <div className="flex-shrink-0">
                {message.includes("success") ? (
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-red-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p
                  className={`text-sm font-medium ${
                    message.includes("success")
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {message}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Group Heading and Count */}
        <div className="mb-8">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold text-gray-700">Your Groups</h2>
            <span className="text-sm text-gray-500">
              {groups.length} groups
            </span>
          </div>
          <div className="mt-1 h-1 w-20 bg-blue-500 rounded"></div>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-gray-600">
              You haven't created any groups yet.
            </p>
            <button
              onClick={() => navigate("/groups/create")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create your first group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Card Header with Color Bar */}
                <div className="h-2 bg-blue-600"></div>

                {/* Card Content */}
                <div className="p-5 flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {group.name}
                    </h3>
                    {group.isPrivate && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Private
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 h-14">
                    {group.description || "No description provided."}
                  </p>

                  <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span className="truncate" title={group.createdBy}>
                      {group.createdBy}
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => navigate(`/groups/view/${group.id}`)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>

                  <div className="flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/groups/chat/${group.id}`);
                      }}
                      className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Chat
                    </button>

                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
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
                          setMessage(`"${group.name}" deleted successfully`);
                        } catch (err) {
                          const msg =
                            err.response?.data?.message || "Delete failed.";
                          alert("Error: " + msg);
                        }
                      }}
                      className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
