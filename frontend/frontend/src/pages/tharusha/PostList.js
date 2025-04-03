import React, { useEffect, useState } from "react";
import { getAllPosts } from "./postService";
import { Link } from "react-router-dom";
import {
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";

// 1) Helper to detect if a URL is a video (handles query params from Firebase, etc.)
function isVideoUrl(url) {
  // Lowercase everything, split off any '?...' query
  const [cleanUrl] = url.toLowerCase().split("?");
  return /\.(mp4|mov|avi|m4v|wmv|flv|webm)$/i.test(cleanUrl);
}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // In-memory state for likes/comments/carousel
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [currentSlide, setCurrentSlide] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();

        // Initialize liked status, comments, and current slide for each post
        const initialLikedStatus = {};
        const initialComments = {};
        const initialCommentInputs = {};
        const initialCurrentSlide = {};

        data.forEach((post) => {
          initialLikedStatus[post.id] = false; // or post.likedByUser if you have that
          initialComments[post.id] = post.comments || [];
          initialCommentInputs[post.id] = "";
          initialCurrentSlide[post.id] = 0;
        });

        setPosts(data);
        setLikedPosts(initialLikedStatus);
        setComments(initialComments);
        setCommentInputs(initialCommentInputs);
        setCurrentSlide(initialCurrentSlide);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to fetch posts. Please check console or backend logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 2) Like Handler
  const handleLike = (postId) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    // Normally also call backend to update likes
  };

  // 3) Comment input and submit handlers
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    if (commentInputs[postId].trim()) {
      const newComment = {
        id: Date.now(),
        text: commentInputs[postId],
        username: "currentUser", // Replace with actual user info
        timestamp: new Date().toISOString(),
      };

      setComments((prev) => ({
        ...prev,
        [postId]: [...prev[postId], newComment],
      }));

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
      // Also call backend to store the comment
    }
  };

  // 4) Carousel next/prev slide
  const goToNextSlide = (postId, mediaUrls) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [postId]: (prev[postId] + 1) % mediaUrls.length,
    }));
  };

  const goToPrevSlide = (postId, mediaUrls) => {
    setCurrentSlide((prev) => ({
      ...prev,
      [postId]: (prev[postId] - 1 + mediaUrls.length) % mediaUrls.length,
    }));
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-3xl lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* No posts case */}
      {!error && posts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found.</p>
        </div>
      )}

      {/* Main posts loop */}
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
        >
          {/* Post Header */}
          <div className="flex items-center p-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              {post.userAvatar ? (
                <img
                  src={post.userAvatar}
                  alt={post.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">
                  {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="ml-3">
              <p className="font-semibold text-gray-900">
                {post.username || "Anonymous"}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-auto">
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-2">
            <p className="text-gray-800 mb-4">{post.description}</p>
          </div>

          {/* Post Media with Carousel */}
          {post.mediaUrls && post.mediaUrls.length > 0 && (
            <div className="relative w-full">
              {/* Media Display */}
              <div className="w-full relative">
                {post.mediaUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`w-full transition-opacity duration-300 ${
                      index === currentSlide[post.id] ? "block" : "hidden"
                    }`}
                  >
                    {/* Use isVideoUrl helper */}
                    {isVideoUrl(url) ? (
                      <video
                        className="w-full h-auto max-h-96 object-contain"
                        controls
                        src={url}
                        poster={post.thumbnailUrl}
                      />
                    ) : (
                      <img
                        src={url}
                        alt={`Post media ${index + 1}`}
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Carousel Navigation */}
              {post.mediaUrls.length > 1 && (
                <>
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPrevSlide(post.id, post.mediaUrls)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={() => goToNextSlide(post.id, post.mediaUrls)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                  </button>

                  {/* Indicator Dots */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2">
                    {post.mediaUrls.map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-2 rounded-full ${
                          i === currentSlide[post.id]
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Interaction Bar */}
          <div className="px-4 py-2 flex items-center border-t border-gray-100">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center mr-6 ${
                likedPosts[post.id] ? "text-red-500" : "text-gray-500"
              } hover:text-red-500`}
            >
              <HeartIcon
                className="h-6 w-6 mr-1"
                fill={likedPosts[post.id] ? "currentColor" : "none"}
              />
              <span>
                {post.likes
                  ? post.likes.length + (likedPosts[post.id] ? 1 : 0)
                  : likedPosts[post.id]
                  ? 1
                  : 0}
              </span>
            </button>

            <button className="flex items-center mr-6 text-gray-500 hover:text-blue-500">
              <MessageCircleIcon className="h-6 w-6 mr-1" />
              <span>{comments[post.id] ? comments[post.id].length : 0}</span>
            </button>

            <button className="flex items-center mr-6 text-gray-500 hover:text-green-500">
              <ShareIcon className="h-6 w-6 mr-1" />
            </button>

            <button className="flex items-center ml-auto text-gray-500 hover:text-black">
              <BookmarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Comments Section */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            {/* Comment List (preview) */}
            {comments[post.id] && comments[post.id].length > 0 && (
              <div className="mb-3">
                {/* Show only first two comments in preview */}
                {comments[post.id].slice(0, 2).map((comment) => (
                  <div key={comment.id} className="flex mb-2">
                    <div className="mr-2 font-semibold text-sm">
                      {comment.username}
                    </div>
                    <div className="text-sm text-gray-800">{comment.text}</div>
                  </div>
                ))}

                {comments[post.id].length > 2 && (
                  <Link
                    to={`/post/${post.id}`}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    View all {comments[post.id].length} comments
                  </Link>
                )}
              </div>
            )}

            {/* Comment Input */}
            <div className="flex items-center mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInputs[post.id] || ""}
                onChange={(e) => handleCommentChange(post.id, e.target.value)}
                className="flex-grow bg-transparent text-sm text-gray-800 placeholder-gray-400 border-none focus:ring-0"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                disabled={
                  !commentInputs[post.id] ||
                  !commentInputs[post.id].trim()
                }
                className={`ml-2 text-sm font-semibold ${
                  commentInputs[post.id] && commentInputs[post.id].trim()
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-blue-300"
                }`}
              >
                Post
              </button>
            </div>
          </div>

          {/* View Details Link */}
          <div className="px-4 py-2 border-t border-gray-100">
            <Link
              to={`/post/${post.id}`}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
