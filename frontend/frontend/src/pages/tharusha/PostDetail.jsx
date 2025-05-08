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

  if (error) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    </div>
  );
  
  if (!post) return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back
      </button>
      
      {/* Main post card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Post Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Post Detail</h1>
              <p className="text-gray-500 text-sm mt-1">
                Posted {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            {/* Edit/Delete controls */}
            {isOwner && (
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigate(`/editpost/${post.id}`)}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          
          {/* Post description */}
          <div className="mt-4">
            <p className="text-gray-800">{post.description}</p>
          </div>
          
          {/* Hashtags if available */}
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
        
        {/* Media Gallery */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="border-b border-gray-100">
            <div className={`grid ${post.mediaUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-1`}>
              {post.mediaUrls.map((url, index) => (
                <div key={index} className="aspect-square overflow-hidden">
                  {url.endsWith(".mp4") ? (
                    <video 
                      src={url} 
                      controls 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img 
                      src={url} 
                      alt={`Post media ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Like button and stats */}
        <div className="p-4 border-b border-gray-100">
          <button 
            onClick={handleLike}
            className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
            </svg>
            <span>Like</span>
            {post.likes && <span className="font-medium ml-1">({post.likes})</span>}
          </button>
        </div>
        
        {/* Comments section */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Comments</h3>
          
          {/* Comments list */}
          <div className="space-y-4 mb-6">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((c, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2">
                      {c.commentedBy.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-800">{c.commentedBy}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {c.createdAt && new Date(c.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 pl-10">{c.commentText}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
          
          {/* Add comment form */}
          <div className="mt-6">
            <div className="flex">
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button 
                onClick={handleComment}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;