import React, { useState } from 'react';
import axios from '../../axiosConfig';

const CommentBox = ({ postId, userId }) => {
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);

  const submitComment = async () => {
    try {
      await axios.post(`/api/reactions/comment/${postId}`, {
        userId,
        content: comment
      });
      setSuccess(true);
      setComment('');
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="mt-4">
      <textarea
        className="w-full border p-2 rounded"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        rows="2"
      />
      <button
        className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
        onClick={submitComment}
        disabled={!comment.trim()}
      >
        Post Comment
      </button>
      {success && <p className="text-green-500 mt-1 text-sm">Comment added!</p>}
    </div>
  );
};

export default CommentBox;
