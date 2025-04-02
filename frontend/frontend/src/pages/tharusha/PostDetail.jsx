// src/pages/PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  likePost,
  addComment,
  deletePost
} from "./postService";

function PostDetail() {
  const { id } = useParams();       // matches /posts/:id
  const navigate = useNavigate();   // for redirecting if we delete
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  // Assume logged-in user stored in sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user")); 

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  const fetchPost = async () => {
    try {
      const data = await getPostById(id);
      setPost(data);

      // Check if the post belongs to current user
      if (user && user.email && data.userId === user.email) {
        setIsOwner(true);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch post");
    }
  };

  // Handle Like
  const handleLike = async () => {
    try {
      await likePost(id);
      // Optionally refresh post data to see updated like count
      fetchPost();
    } catch (err) {
      console.error(err);
      setError("Failed to like post");
    }
  };

  // Handle Comment
  const handleComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment(id, commentText);
      setCommentText("");
      fetchPost(); // reload to see updated comments
    } catch (err) {
      console.error(err);
      setError("Failed to add comment");
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    try {
      await deletePost(id);
      navigate("/myposts"); // or wherever you want to redirect
    } catch (err) {
      console.error(err);
      setError("Failed to delete post");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h1>Post Detail</h1>
      <h3>Description: {post.description}</h3>
      <p>Created At: {new Date(post.createdAt).toLocaleString()}</p>

      {post.mediaUrls && post.mediaUrls.map((url, index) => (
        <div key={index}>
          {url.endsWith(".mp4") ? (
            <video src={url} width="300" controls />
          ) : (
            <img src={url} alt="post-media" width="300" />
          )}
        </div>
      ))}

      {/* Example "Like" Button */}
      <button onClick={handleLike}>Like</button>

      {/* Comments Section */}
      <div>
        <h4>Comments:</h4>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((c, idx) => (
            <div key={idx} style={{ marginTop: "8px" }}>
              <strong>{c.commentedBy}</strong>: {c.commentText}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        {/* Add Comment Form */}
        <div style={{ marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Add a comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button onClick={handleComment}>Submit</button>
        </div>
      </div>

      {/* Edit / Delete Buttons for the Owner */}
      {isOwner && (
        <div style={{ marginTop: "16px" }}>
          {/* Example: you'd need an Edit page or inline editing */}
          <button onClick={() => navigate(`/editpost/${post.id}`)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default PostDetail;
