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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Posts</h2>
        <Link
          to="/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-full transition-colors shadow-sm"
        >
          + New Post
        </Link>
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 
                 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 
                 0 012.828 0L20 14m-6-6h.01M6 20h12
                 a2 2 0 002-2V6a2 2 0 00-2-2H6a2 
                 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-lg text-gray-600">You haven't created any posts yet.</p>
          <Link
            to="/create-post"
            className="text-blue-600 font-medium mt-4 inline-block hover:text-blue-800"
          >
            Create your first post
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          const firstMedia = post.mediaUrls && post.mediaUrls[0];
          return (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative bg-gray-100 aspect-square overflow-hidden">
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
                      alt="Post"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586
                           a2 2 0 012.828 0L16 16m-2-2
                           l1.586-1.586a2 2 0 012.828 
                           0L20 14m-6-6h.01M6 20h12a2 
                           2 0 002-2V6a2 2 0 00-2-2H6
                           a2 2 0 00-2 2v12a2 2 0 
                           002 2z"
                      />
                    </svg>
                  </div>
                )}

                {/* Badge if multiple media */}
                {post.mediaUrls && post.mediaUrls.length > 1 && (
                  <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white px-2 py-1 rounded-md text-xs">
                    +{post.mediaUrls.length - 1} more
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-gray-800 font-medium mb-2 line-clamp-2">
                  {post.description}
                </p>

                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <Link
                    to={`/posts/${post.id}`}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyPosts;
