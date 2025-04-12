import React, { useState } from 'react';
import axios from '../../axiosConfig'; // or adjust if needed

const LikeButton = ({ postId, userId }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    try {
      await axios.post(`/api/reactions/like/${postId}?userId=${userId}`);
      setLiked(true);
    } catch (error) {
      console.error("Like failed", error);
    }
  };

  return (
    <button
      className={`px-3 py-1 rounded ${liked ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
      onClick={handleLike}
      disabled={liked}
    >
      {liked ? 'Liked' : 'Like'}
    </button>
  );
};

export default LikeButton;
