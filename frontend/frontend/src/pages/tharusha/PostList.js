import React, { useEffect, useState } from "react";
import { getAllPosts } from "./postService";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Share,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  TrendingUp,
  Grid,
  AlignJustify,
  Camera,
  Clock,
  Calendar,
  User,
  MapPin,
  PlusCircle,
  Video,
  Image as ImageIcon,
  RefreshCw
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
  const [savedPosts, setSavedPosts] = useState({});
  const [comments, setComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [currentSlide, setCurrentSlide] = useState({});
  
  // NEW: search and filter controls
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const [selectedFilter, setSelectedFilter] = useState("latest");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ------------------------------------------------------------------ */
  /* Fetch posts once on mount                                          */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();

      // Initialise helper structures for likes, comments & carousel
      const initLikes = {};
      const initSaved = {};
      const initComments = {};
      const initInputs = {};
      const initSlides = {};

      data.forEach((p) => {
        initLikes[p.id] = false;
        initSaved[p.id] = false;
        initComments[p.id] = p.comments || [];
        initInputs[p.id] = "";
        initSlides[p.id] = 0;
      });

      setPosts(data);
      setLikedPosts(initLikes);
      setSavedPosts(initSaved);
      setComments(initComments);
      setCommentInputs(initInputs);
      setCurrentSlide(initSlides);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch posts. Please check console or backend logs.");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /* Search & filtering                                                 */
  /* ------------------------------------------------------------------ */
  const filteredPosts = posts
    .filter((post) => {
      if (!searchTerm.trim()) return true;
      const term = searchTerm.toLowerCase();

      const matchTitle = post.description && post.description.toLowerCase().includes(term);
      const matchUsername = post.username && post.username.toLowerCase().includes(term);
      const matchTags = post.hashtags && post.hashtags.some((tag) => 
        tag.replace(/^#/, "").toLowerCase().includes(term)
      );

      return matchTitle || matchTags || matchUsername;
    })
    .sort((a, b) => {
      switch (selectedFilter) {
        case "latest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "popular":
          const aLikes = a.likes?.length || 0;
          const bLikes = b.likes?.length || 0;
          return bLikes - aLikes;
        case "comments":
          const aComments = a.comments?.length || 0;
          const bComments = b.comments?.length || 0;
          return bComments - aComments;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  /* ------------------------------------------------------------------ */
  /* Handlers                                                           */
  /* ------------------------------------------------------------------ */
  const handleLike = (postId) => {
    setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleSave = (postId) => {
    setSavedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentChange = (postId, val) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: val }));
  };

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

  const goToNextSlide = (id, arr) => {
    setCurrentSlide((p) => ({ ...p, [id]: (p[id] + 1) % arr.length }));
  };

  const goToPrevSlide = (id, arr) => {
    setCurrentSlide((p) => ({
      ...p,
      [id]: (p[id] - 1 + arr.length) % arr.length,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts().finally(() => {
      setTimeout(() => setRefreshing(false), 800);
    });
  };

  /* Helper functions */
  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return ${diffInSeconds}s ago;
    if (diffInSeconds < 3600) return ${Math.floor(diffInSeconds / 60)}m ago;
    if (diffInSeconds < 86400) return ${Math.floor(diffInSeconds / 3600)}h ago;
    if (diffInSeconds < 604800) return ${Math.floor(diffInSeconds / 86400)}d ago;
    
    return new Date(dateString).toLocaleDateString();
  };

  const renderMediaIndicator = (post) => {
    if (!post.mediaUrls?.length) return null;

    const videoCount = post.mediaUrls.filter(url => isVideoUrl(url)).length;
    const imageCount = post.mediaUrls.length - videoCount;

    return (
      <div className="absolute top-3 right-3 flex space-x-2">
        {imageCount > 0 && (
          <div className="bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1 flex items-center">
            <ImageIcon className="h-3 w-3 mr-1" />
            <span>{imageCount}</span>
          </div>
        )}
        {videoCount > 0 && (
          <div className="bg-black bg-opacity-60 text-white text-xs rounded-full px-2 py-1 flex items-center">
            <Video className="h-3 w-3 mr-1" />
            <span>{videoCount}</span>
          </div>
        )}
      </div>
    );
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
        <p className="mt-4 text-gray-600">Loading awesome content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:max-w-4xl lg:px-8 bg-gray-50 min-h-screen">
      {/* -------- Header & Search -------- */}
      <div className="sticky top-0 z-10 bg-white shadow-sm rounded-lg mb-6 py-4 px-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Feed
            <span className="ml-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-full px-2 py-1">
              Explore
            </span>
          </h1>
          
          <div className="flex space-x-3">
            <button 
              onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              {viewMode === "list" ? (
                <Grid className="h-5 w-5" />
              ) : (
                <AlignJustify className="h-5 w-5" />
              )}
            </button>
            
            <button 
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors relative"
            >
              <Filter className="h-5 w-5" />
              {selectedFilter !== "latest" && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
            
            <button 
              onClick={handleRefresh}
              className={`p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors ${
                refreshing ? "animate-spin text-blue-600" : ""
              }`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by title, #tag, or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 bg-gray-100 border-0 text-gray-900 placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                onClick={() => setSearchTerm("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
        
        {/* Filter Menu */}
        {showFilterMenu && (
          <div className="mt-2 p-2 bg-white shadow-lg rounded-lg border border-gray-100 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "latest", label: "Latest", icon: <Clock className="h-4 w-4" /> },
                { id: "popular", label: "Popular", icon: <TrendingUp className="h-4 w-4" /> },
                { id: "comments", label: "Most Discussed", icon: <MessageCircle className="h-4 w-4" /> }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setShowFilterMenu(false);
                  }}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    selectedFilter === filter.id 
                      ? "bg-blue-100 text-blue-700" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {filter.icon}
                  <span className="ml-2 text-sm font-medium">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* -------- Error Message -------- */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* -------- Filter Info -------- */}
      {selectedFilter !== "latest" && (
        <div className="mb-4 flex items-center bg-blue-50 text-blue-800 px-4 py-2 rounded-lg">
          <Filter className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">
            Showing {selectedFilter === "popular" ? "most popular" : "most discussed"} posts
          </span>
          <button 
            onClick={() => setSelectedFilter("latest")}
            className="ml-auto text-xs text-blue-700 hover:text-blue-900 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </button>
        </div>
      )}

      {/* -------- Empty State -------- */}
      {!error && filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Camera className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No posts found</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            {searchTerm 
              ? "Try adjusting your search terms or filters"
              : "Be the first to share something amazing"}
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Post
          </button>
        </div>
      )}

      {/* -------- Post Cards -------- */}
      <div className={viewMode === "grid" 
        ? "grid grid-cols-1 md:grid-cols-2 gap-6" 
        : "space-y-6"
      }>
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-center p-4">
              <Link to={/profile/${post.userId}} className="flex items-center flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden flex items-center justify-center">
                  {post.userAvatar ? (
                    <img
                      src={post.userAvatar}
                      alt={post.username}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-bold">
                      {post.username ? post.username[0].toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900 text-sm">
                    {post.username || "Anonymous"}
                    {post.verified && (
                      <span className="inline-block ml-1 bg-blue-500 text-white rounded-full p-0.5">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTimeAgo(post.createdAt)}
                    {post.location && (
                      <>
                        <span className="mx-1">•</span>
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{post.location}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            </div>

            {/* Description */}
            <div className="px-4 pb-2">
              <p className="text-gray-800 mb-3 line-clamp-3">{post.description}</p>
              
              {/* Hashtags */}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 text-xs font-medium"
                    >
                      {tag.startsWith('#') ? tag : #${tag}}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Media carousel */}
            {post.mediaUrls?.length > 0 && (
              <div className="relative w-full">
                <div className="w-full relative bg-gray-100">
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
                          alt={media-${idx}}
                          className="w-full h-auto max-h-96 object-contain"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {renderMediaIndicator(post)}

                {post.mediaUrls.length > 1 && (
                  <>
                    {/* prev / next */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        goToPrevSlide(post.id, post.mediaUrls);
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 shadow-md hover:bg-opacity-90 transition-all"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        goToNextSlide(post.id, post.mediaUrls);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1.5 shadow-md hover:bg-opacity-90 transition-all"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>

                    {/* dots */}
                    <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-2">
                      {post.mediaUrls.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentSlide((p) => ({ ...p, [post.id]: i }))}
                          className={`h-2 w-2 rounded-full ${
                            i === currentSlide[post.id]
                              ? "bg-blue-500"
                              : "bg-gray-300 hover:bg-gray-400"
                          } transition-colors`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Interaction bar */}
            <div className="px-4 py-3 flex items-center border-t border-gray-100">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center mr-6 transition-colors ${
                  likedPosts[post.id] ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
              >
                <Heart
                  className={h-5 w-5 mr-1.5 ${likedPosts[post.id] ? "fill-current animate-pulse" : ""}}
                  size={20}
                />
                <span className="text-sm font-medium">
                  {post.likes
                    ? post.likes.length + (likedPosts[post.id] ? 1 : 0)
                    : likedPosts[post.id]
                    ? 1
                    : 0}
                </span>
              </button>

              <button className="flex items-center mr-6 text-gray-500 hover:text-blue-500 transition-colors">
                <MessageCircle className="h-5 w-5 mr-1.5" size={20} />
                <span className="text-sm font-medium">{comments[post.id]?.length || 0}</span>
              </button>

              <button className="flex items-center mr-6 text-gray-500 hover:text-green-500 transition-colors">
                <Share className="h-5 w-5 mr-1.5" size={20} />
              </button>

              <button 
                onClick={() => handleSave(post.id)}
                className={`flex items-center ml-auto transition-colors ${
                  savedPosts[post.id] ? "text-blue-500" : "text-gray-500 hover:text-blue-500"
                }`}
              >
                <Bookmark
                  className={h-5 w-5 ${savedPosts[post.id] ? "fill-current" : ""}}
                  size={20}
                />
              </button>
            </div>

            {/* Comments preview & input */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
              {comments[post.id]?.length > 0 && (
                <div className="mb-3">
                  {comments[post.id].slice(0, 2).map((c) => (
                    <div key={c.id} className="flex mb-2 text-sm">
                      <span className="mr-2 font-medium text-gray-900">
                        {c.username}
                      </span>
                      <span className="text-gray-800">{c.text}</span>
                    </div>
                  ))}
                  {comments[post.id].length > 2 && (
                    <Link
                      to={/post/${post.id}}
                      className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                    >
                      View all {comments[post.id].length} comments
                    </Link>
                  )}
                </div>
              )}

              <div className="flex items-center">
                <div className="h-7 w-7 rounded-full bg-gray-200 mr-2 flex-shrink-0 overflow-hidden">
                  <User className="h-full w-full text-gray-500 p-1.5" />
                </div>
                <input
                  type="text"
                  placeholder="Add a comment…"
                  value={commentInputs[post.id] || ""}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                  className="flex-grow bg-transparent text-sm text-gray-800 placeholder-gray-400 border-none focus:ring-0"
                />
                <button
                  onClick={() => handleCommentSubmit(post.id)}
                  disabled={!commentInputs[post.id]?.trim()}
                  className={`ml-2 text-sm font-medium ${
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
            <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
              <Link
                to={/post/${post.id}}
                className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                View Details
              </Link>
              
              <div className="text-xs text-gray-500">
                <Calendar className="h-3 w-3 inline mr-1" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Add FAB for posting new content */}
      <div className="fixed bottom-8 right-8">
        <Link
          to="/new-post"
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        >
          <PlusCircle size={26} />
        </Link>
      </div>
    </div>
  );
}

export default PostList;