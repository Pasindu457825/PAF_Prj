import React, { useState, useEffect } from "react";
import axiosInstance from "../Notification/axiosConfig";

const EditCommentForm = ({ commentId, onClose, onUpdated }) => {
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await axiosInstance.get(`/comments/${commentId}`);
        setCommentText(res.data.commentText);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load comment", err);
        setError("Failed to load comment. Please try again.");
        setLoading(false);
      }
    };

    if (commentId) fetchComment();
  }, [commentId]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (commentText.trim().length < 3) {
      setError("Comment must be at least 3 characters.");
      return;
    }

    try {
      await axiosInstance.put(`/comments/${commentId}`, {
        commentText: commentText.trim(),
      });
      alert("Comment updated successfully ✅");
      onUpdated?.();
      onClose?.();
    } catch (err) {
      console.error("Update error:", err);
      setSubmitError("Failed to update comment. Try again.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading comment...</p>;

  return (
    <form onSubmit={handleUpdate} className="p-6 bg-white rounded shadow max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Comment</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {submitError && <p className="text-red-500 mb-2">{submitError}</p>}

      <textarea
        className="w-full border border-gray-300 p-2 mb-4 rounded"
        rows="4"
        value={commentText}
        onChange={(e) => {
          setCommentText(e.target.value);
          if (e.target.value.trim().length >= 3) setError("");
        }}
        placeholder="Edit your comment..."
        required
      ></textarea>

      <div className="flex justify-end gap-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded text-white ${
            commentText.trim().length >= 3
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={commentText.trim().length < 3}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditCommentForm;
