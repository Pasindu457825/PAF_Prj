// src/pages/PostList.jsx
import React, { useEffect, useState } from "react";
import { getAllPosts } from "./postService"; 
import { Link } from "react-router-dom";

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Attempt to get all posts
        const data = await getAllPosts();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please check console or backend logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div style={{ padding: "16px" }}>
      <h1>All Posts</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* If no error but also no posts */}
      {!error && posts.length === 0 && (
        <p>No posts found.</p>
      )}

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              margin: "8px",
              padding: "8px",
              width: "220px",
            }}
          >
            <h3>{post.description}</h3>

            {/* Render each media URL (images/videos) */}
            {post.mediaUrls && post.mediaUrls.map((url, index) => (
              <div key={index} style={{ marginTop: "8px" }}>
                {url.endsWith(".mp4") || url.endsWith(".mov") ? (
                  <video src={url} width="200" controls />
                ) : (
                  <img src={url} alt="post-media" width="200" />
                )}
              </div>
            ))}

            <div style={{ marginTop: "8px" }}>
              <Link to={`/posts/${post.id}`} style={{ color: "blue" }}>
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostList;
