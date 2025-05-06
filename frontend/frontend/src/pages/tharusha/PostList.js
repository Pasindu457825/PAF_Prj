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

// Helper: detect videos even when Firebase URLs have query params
function isVideoUrl(url) {
  const [clean] = url.toLowerCase().split("?");
  return /\.(mp4|mov|avi|m4v|wmv|flv|webm)$/i.test(clean);
}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // UI / interaction state
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [currentSlide, setCurrentSlide] = useState({});

  // NEW: search term
  const [searchTerm, setSearchTerm] = useState("");

  /* ------------------------------------------------------------------ */
  /* Fetch posts once on mount                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    (async () => {
      try {
        const data = await getAllPosts();

        // Initialise helper structures for likes, comments & carousel
        const initLikes = {};
        const initComments = {};
        const initInputs = {};
        const initSlides = {};

        data.forEach((p) => {
          initLikes[p.id]   = false;
          initComments[p.id] = p.comments || [];
          initInputs[p.id]   = "";
          initSlides[p.id]   = 0;
        });

        setPosts(data);
        setLikedPosts(initLikes);
        setComments(initComments);
        setCommentInputs(initInputs);
        setCurrentSlide(initSlides);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch posts. Please check console or backend logs.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ------------------------------------------------------------------ */
  /* Search filtering                                                   */
  /* ------------------------------------------------------------------ */
  const filteredPosts = posts.filter((post) => {
    if (!searchTerm.trim()) return true;                          // no search
    const term = searchTerm.toLowerCase();

    const matchTitle =
      post.description && post.description.toLowerCase().includes(term);

    const matchTags =
      post.hashtags &&
      post.hashtags.some((tag) =>
        tag.replace(/^#/, "").toLowerCase().includes(term)
      );

    return matchTitle || matchTags;
  });

  /* ------------------------------------------------------------------ */
  /* Handlers                                                           */
  /* ------------------------------------------------------------------ */
  const handleLike = (postId) =>
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));

  const handleCommentChange = (postId, val) =>
    setCommentInputs((prev) => ({ ...prev, [postId]: val }));

  const handleCommentSubmit = (postId) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment = {
      id: Date.now(),
      text,
      username: "currentUser", // TODO replace with real user
      timestamp: new Date().toISOString(),
    };

    setComments((prev) => ({
      ...prev,
      [postId]: [...prev[postId], newComment],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const goToNextSlide = (id, arr) =>
    setCurrentSlide((p) => ({ ...p, [id]: (p[id] + 1) % arr.length }));

  const goToPrevSlide = (id, arr) =>
    setCurrentSlide((p) => ({
      ...p,
      [id]: (p[id] - 1 + arr.length) % arr.length,
    }));

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-3xl lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Feed</h1>

      {/* ---------- Search bar ---------- */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by title or #tag…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ---------- error ---------- */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* ---------- empty ---------- */}
      {!error && filteredPosts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts found.</p>
        </div>
      )}

      {/* ---------- Post cards ---------- */}
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md mb-6 overflow-hidden"
        >
          {/* Header */}
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
                  {post.username ? post.username[0].toUpperCase() : "U"}
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
          </div>

          {/* Description */}
          <div className="px-4 pb-2">
            <p className="text-gray-800 mb-4">{post.description}</p>
          </div>

          {/* Media carousel */}
          {post.mediaUrls?.length > 0 && (
            <div className="relative w-full">
              <div className="w-full relative">
                {post.mediaUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className={`w-full ${
                      idx === currentSlide[post.id] ? "block" : "hidden"
                    }`}
                  >
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
                        alt={`media-${idx}`}
                        className="w-full h-auto max-h-96 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>

              {post.mediaUrls.length > 1 && (
                <>
                  {/* prev / next */}
                  <button
                    onClick={() => goToPrevSlide(post.id, post.mediaUrls)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                  >
                    <ChevronLeftIcon className="h-6 w-6 text-gray-800" />
                  </button>
                  <button
                    onClick={() => goToNextSlide(post.id, post.mediaUrls)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow-md"
                  >
                    <ChevronRightIcon className="h-6 w-6 text-gray-800" />
                  </button>

                  {/* dots */}
                  <div className="absolute bottom-2 inset-x-0 flex justify-center space-x-2">
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

          {/* Interaction bar */}
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
              <span>{comments[post.id]?.length || 0}</span>
            </button>

            <button className="flex items-center mr-6 text-gray-500 hover:text-green-500">
              <ShareIcon className="h-6 w-6 mr-1" />
            </button>

            <button className="flex items-center ml-auto text-gray-500 hover:text-black">
              <BookmarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Comments preview & input */}
          <div className="bg-gray-50 px-4 py-2 border-t border-gray-100">
            {comments[post.id]?.length > 0 && (
              <div className="mb-3">
                {comments[post.id].slice(0, 2).map((c) => (
                  <div key={c.id} className="flex mb-2">
                    <span className="mr-2 font-semibold text-sm">
                      {c.username}
                    </span>
                    <span className="text-sm text-gray-800">{c.text}</span>
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

            <div className="flex items-center mt-2">
              <input
                type="text"
                placeholder="Add a comment…"
                value={commentInputs[post.id] || ""}
                onChange={(e) =>
                  handleCommentChange(post.id, e.target.value)
                }
                className="flex-grow bg-transparent text-sm text-gray-800 placeholder-gray-400 border-none focus:ring-0"
              />
              <button
                onClick={() => handleCommentSubmit(post.id)}
                disabled={!commentInputs[post.id]?.trim()}
                className={`ml-2 text-sm font-semibold ${
                  commentInputs[post.id]?.trim()
                    ? "text-blue-500 hover:text-blue-600"
                    : "text-blue-300"
                }`}
              >
                Post
              </button>
            </div>
          </div>

          {/* Details link */}
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
