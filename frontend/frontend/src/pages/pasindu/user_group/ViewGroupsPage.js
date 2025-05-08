import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, Users, Lock, Globe, MessageCircle, LogOut, Loader, Check, Clock } from "lucide-react";

const ViewGroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, public, private, joined

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) return;
    const userObj = JSON.parse(storedUser);
    setUser(userObj);
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/groups");
      setGroups(response.data);
    } catch (err) {
      console.error("Error fetching groups:", err);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message;
      toast("Error fetching groups: " + errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRequest = async (group) => {
    if (!user?.email) return toast("Please log in to join groups", "warning");

    try {
      if (group.private) {
        // Request to join private group
        await axios.post(`http://localhost:8080/api/groups/${group.id}/request`, null, {
          params: { userEmail: user.email },
        });
        toast("Join request sent successfully!", "success");
      } else {
        // Join public group directly
        await axios.post(`http://localhost:8080/api/groups/${group.id}/join`, null, {
          params: { userEmail: user.email },
        });
        toast("You've joined the group successfully!", "success");
      }
      fetchGroups(); // Refresh UI
    } catch (err) {
      toast("Error: " + (err.response?.data?.message || err.message), "error");
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    if (!user?.email) return toast("User not logged in", "warning");

    if (window.confirm(`Are you sure you want to leave "${groupName}"?`)) {
      try {
        await axios.post(`http://localhost:8080/api/groups/${groupId}/leave`, null, {
          params: { userEmail: user.email },
        });
        toast("You have left the group successfully", "success");
        fetchGroups(); // Refresh group list
      } catch (err) {
        toast("Error leaving group: " + (err.response?.data?.message || err.message), "error");
      }
    }
  };

  // Toast notification function
  const toast = (message, type = "info") => {
    // For simplicity using alert, but in production use a proper toast library
    const emoji = type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️";
    alert(`${emoji} ${message}`);
  };

  // Filter groups based on search term and filter selection
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          group.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === "all") return matchesSearch;
    if (filter === "public") return !group.private && matchesSearch;
    if (filter === "private") return group.private && matchesSearch;
    if (filter === "joined") return group.memberIds.includes(user?.email) && matchesSearch;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 py-8 px-6 shadow-md">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Discover Groups</h1>
          <p className="text-blue-100">Find and join communities that match your interests</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search groups by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === "all" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("public")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                filter === "public" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Globe className="h-4 w-4 mr-1" /> Public
            </button>
            <button 
              onClick={() => setFilter("private")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                filter === "private" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Lock className="h-4 w-4 mr-1" /> Private
            </button>
            <button 
              onClick={() => setFilter("joined")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center ${
                filter === "joined" 
                  ? "bg-blue-600 text-white" 
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Check className="h-4 w-4 mr-1" /> Joined
            </button>
          </div>
        </div>

        {/* Groups List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading groups...</span>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700">No groups found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "Try adjusting your search" : "Join or create a group to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300"
              >
                {/* Group Header - Color based on type */}
                <div className={`h-3 ${group.private ? "bg-purple-500" : "bg-blue-500"}`}></div>
                
                {/* Group Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 truncate">{group.name}</h3>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      group.private 
                        ? "bg-purple-100 text-purple-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {group.private ? (
                        <><Lock className="h-3 w-3 mr-1" /> Private</>
                      ) : (
                        <><Globe className="h-3 w-3 mr-1" /> Public</>
                      )}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{group.memberIds?.length || 0} members</span>
                    <span className="mx-2">•</span>
                    <span>Created by {group.createdBy}</span>
                  </div>
                  
                  {/* Action Buttons */}
                  {group.memberIds?.includes(user?.email) ? (
                    <div className="flex space-x-2">
                      <a
                        href={`/groups/chat/${group.id}`}
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Open Chat
                      </a>
                      <button
                        onClick={() => handleLeaveGroup(group.id, group.name)}
                        className="inline-flex justify-center items-center px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ) : group.pendingRequests?.includes(user?.email) ? (
                    <button
                      className="w-full inline-flex justify-center items-center px-4 py-2 bg-yellow-500 text-white rounded-md cursor-default"
                      disabled
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Request Pending
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinRequest(group)}
                      className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                    >
                      {group.private ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Request to Join
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4 mr-2" />
                          Join Group
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>Connect with like-minded people and grow your network</p>
          <p className="mt-2">© {new Date().getFullYear()} Your App Name. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default ViewGroupsPage;