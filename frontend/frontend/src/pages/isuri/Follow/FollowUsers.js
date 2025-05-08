import React, { useEffect, useState } from 'react';

function FollowUsers() {
  const [followedUsers, setFollowedUsers] = useState([]);
  const loggedInUserId = localStorage.getItem('userId');

  useEffect(() => {
    // First fetch just the IDs of followed users
    fetch(`http://localhost:8080/api/users/${loggedInUserId}/followed`)
      .then((response) => response.json())
      .then((userIds) => {
        // Then fetch details for all these users
        return fetch(`http://localhost:8080/api/users/details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userIds),
        });
      })
      .then((response) => response.json())
      .then((userDetails) => {
        setFollowedUsers(userDetails);
      });
  }, [loggedInUserId]);

  const handleUnfollow = (userId) => {
    fetch(`http://localhost:8080/api/users/${loggedInUserId}/unfollow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unfollowUserId: userId }),
    })
      .then((response) => response.json())
      .then(() => {
        setFollowedUsers((prev) => prev.filter((user) => user.id !== userId));
      });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Followed Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {followedUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
          >
            <img
              src={user.profileImage || '/default-profile.png'}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h2 className="text-lg font-semibold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">@{user.username}</p>
            <button
              onClick={() => handleUnfollow(user.id)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Unfollow
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FollowUsers;
