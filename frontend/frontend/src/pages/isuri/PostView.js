import React from 'react';
import LikeButton from './LikeButton';
import CommentBox from './CommentBox';

const PostView = ({ postId, userId }) => {
  // You can pass `postId` and `userId` from parent component or route
  return (
    <div className="border p-4 rounded shadow-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Post Title</h2>
      <p className="mb-4">Post content goes here...</p>

      <LikeButton postId={postId} userId={userId} />
      <CommentBox postId={postId} userId={userId} />
    </div>
  );
};

export default PostView;
