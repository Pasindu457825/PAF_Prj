import React, { useEffect, useState } from "react";
import { getPostsByUser } from "./postService";
import { Link } from "react-router-dom";

function isVideoUrl(url) {
  // Convert to lowercase, split off query params
  const [cleanUrl] = url.toLowerCase().split("?");
  // Check if the cleaned URL ends with a known video extension
  return /\.(mp4|mov|avi|m4v|wmv|flv|webm)$/i.test(cleanUrl);
}

function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  // Retrieve user from sessionStorage
  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.email) {
      setError("No user is logged in!");
      return;
    }
    fetchUserPosts(user.email);
    // eslint-disable-next-line
  }, []);

  const fetchUserPosts = async (email) => {
    try {
      const data = await getPostsByUser(email);
      setPosts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch your posts");
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow-sm text-center my-4 max-w-4xl mx-auto">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">My Skills Portfolio</h2>
            <p className="text-gray-500">Showcase your expertise and connect with others</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center px-3 py-2 rounded-md ${
                  viewMode === "grid" ? "bg-white shadow-sm" : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center px-3 py-2 rounded-md ${
                  viewMode === "list" ? "bg-white shadow-sm" : "text-gray-500 hover:bg-gray-200"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                  <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                </svg>
                List
              </button>
            </div>
            <Link
              to="/create"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
                <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
              </svg>
              Add Skill
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <div className="bg-blue-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-12 h-12 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Share Your First Skill</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Showcase your expertise, attract opportunities, and connect with others in your field.
          </p>
          <Link
            to="/create-post"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="mr-2">
              <path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
            Add Your First Skill
          </Link>
        </div>
      )}

      {/* Grid View */}
      {posts.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const firstMedia = post.mediaUrls && post.mediaUrls[0];
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 aspect-video overflow-hidden">
                  {firstMedia ? (
                    isVideoUrl(firstMedia) ? (
                      <video
                        src={firstMedia}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={firstMedia}
                        alt="Skill showcase"
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                      <svg
                        className="w-16 h-16 text-blue-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Badge if multiple media */}
                  {post.mediaUrls && post.mediaUrls.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs font-medium">
                      +{post.mediaUrls.length - 1} more
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-gray-800 font-semibold text-lg mb-3 line-clamp-2">
                    {post.description}
                  </p>

                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500 font-medium">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      to={`/posts/${post.id}`}
                      className="text-blue-600 text-sm font-semibold hover:text-blue-800 flex items-center"
                    >
                      View Details
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {posts.length > 0 && viewMode === "list" && (
        <div className="flex flex-col gap-4">
          {posts.map((post) => {
            const firstMedia = post.mediaUrls && post.mediaUrls[0];
            return (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative bg-gradient-to-br from-blue-50 to-indigo-50 md:h-auto">
                    {firstMedia ? (
                      isVideoUrl(firstMedia) ? (
                        <video
                          src={firstMedia}
                          className="w-full h-48 md:h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={firstMedia}
                          alt="Skill showcase"
                          className="w-full h-48 md:h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-48 md:h-full flex items-center justify-center">
                        <svg
                          className="w-16 h-16 text-blue-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Badge if multiple media */}
                    {post.mediaUrls && post.mediaUrls.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs font-medium">
                        +{post.mediaUrls.length - 1} more
                      </div>
                    )}
                  </div>

                  <div className="p-5 md:w-3/4 flex flex-col justify-between">
                    <div>
                      <p className="text-gray-800 font-semibold text-lg mb-3">
                        {post.description}
                      </p>

                      {post.hashtags && post.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.hashtags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 font-medium">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        to={`/posts/${post.id}`}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-lg transition-colors inline-flex items-center"
                      >
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="ml-1">
                          <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyPosts;