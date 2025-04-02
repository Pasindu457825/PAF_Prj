// src/pages/MyPosts.jsx
import React, { useEffect, useState } from "react";
import { getPostsByUser } from "./postService"; // adjust path as needed

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // Example of retrieving user from sessionStorage:
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.email) {
      setError("No user is logged in!");
      return;
    }
    fetchUserPosts(user.email);
    // eslint-disable-next-line
  }, []);

  const fetchUserPosts = async (email) => {
    try {
      const data = await getPostsByUser(email);
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your posts");
    }
  };

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>My Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ border: "1px solid #ccc", margin: 8, padding: 8 }}>
            <h3>{post.description}</h3>
            {post.mediaUrls &&
              post.mediaUrls.map((url, i) => (
                <div key={i}>
                  {url.endsWith(".mp4") ? (
                    <video src={url} width="200" controls />
                  ) : (
                    <img src={url} alt="post" width="200" />
                  )}
                </div>
              ))}
            <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>
            <a href={`/posts/${post.id}`}>View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyPosts;
