import React, { useEffect, useState } from 'react';

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);

  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    // Fetch all users from the backend
    fetch('http://localhost:8080/api/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });

    // Fetch followed users for the logged-in user
    fetch(`http://localhost:8080/api/users/${loggedInUserId}/followed`)
      .then((response) => response.json())
      .then((data) => {
        setFollowedUsers(data);
      });
  }, [loggedInUserId]);

  const handleFollow = (userId) => {
    fetch(`http://localhost:8080/api/users/${loggedInUserId}/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followUserId: userId }),
    })
      .then((response) => response.json())
      .then(() => {
        setFollowedUsers((prev) => [...prev, userId]);
      });
  };

  const filteredUsers = users.filter(
    (user) => user.id !== loggedInUserId && !followedUsers.includes(user.id)
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">Profile Picture</th>
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="border border-gray-300 px-4 py-2">
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full"
                />
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  onClick={() => handleFollow(user.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Follow
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllUsers;
