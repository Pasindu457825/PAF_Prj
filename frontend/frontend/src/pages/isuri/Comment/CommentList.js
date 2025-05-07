import React, { useEffect, useState } from "react";
import axiosInstance from "../Notification/axiosConfig";
import { Link } from "react-router-dom";

const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load comments
  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get("/comments");
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // Delete a comment
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await axiosInstance.delete(`/comments/${id}`);
      alert("Comment deleted ✅");
      fetchComments(); // refresh list
    } catch (err) {
      console.error("Failed to delete comment", err);
      alert("Delete failed ❌");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">Comment List</h1>

      {loading ? (
        <p>Loading...</p>
      ) : comments.length === 0 ? (
        <p>No comments available.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="p-3 border-b flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{comment.commentText}</p>
              <small className="text-gray-500">User ID: {comment.userId}</small>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/comments/edit/${comment.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(comment.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
