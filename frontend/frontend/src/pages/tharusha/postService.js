// src/api/postService.js
import axiosInstance from "./axiosConfig";

/**
 * Get posts by user
 *    GET /api/posts/user/{email}
 */
export const getPostsByUser = async (userEmail) => {
  const response = await axiosInstance.get(`/posts/user/${userEmail}`, {
    withCredentials: true, // if using session cookies
  });
  return response.data;
};

/**
 * Get a single post by its ID
 *    GET /api/posts/:id
 */
export const getPostById = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Create a post (JSON version)
 *    POST /api/posts
 */
export const createPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Create a post with multipart/form-data (for file uploads)
 *    POST /api/posts
 */
export const uploadPostWithMedia = async (postData, files) => {
  const formData = new FormData();
  formData.append("description", postData.description || "");
  if (postData.hashtags) {
    postData.hashtags.forEach((tag) => {
      formData.append("hashtags", tag);
    });
  }
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await axiosInstance.post("/posts", formData, {
    withCredentials: true,
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

/**
 * Like a post
 *    POST /api/posts/:id/like
 */
export const likePost = async (postId, userId) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/like`,
    { userId }, // Send userId in request body
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" }, // Explicit content-type
    }
  );
  return response.data;
};

/**
 * Add a comment to a post
 *    POST /api/posts/:id/comments
 */
/**
 * Add a comment to a post
 *    POST /api/posts/:id/comments
 */
export const addComment = async (postId, commentText) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/comments`,
    { commentText }, // Send just the comment text
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};
/**
 * Delete a post
 *    DELETE /api/posts/:id
 */
export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get all posts
 *    GET /api/posts
 */
export const getAllPosts = async () => {
  // Adding withCredentials here too, to match the rest:
  const response = await axiosInstance.get("/posts", {
    withCredentials: true,
  });
  return response.data;
};

// 8) Update a post (PUT /posts/:id)
export const updatePost = async (postId, updatedPostData) => {
  // updatedPostData = { description, hashtags: [...], mediaUrls: [...] }
  const response = await axiosInstance.put(`/posts/${postId}`, updatedPostData, {
    withCredentials: true,
  });
  return response.data;
};
const handleLike = async (postId) => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("You must be logged in to like a post.");
    return;
  }

  try {
    const response = await fetch(`/api/posts/${postId}/like`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (response.ok) {
      const data = await response.json();
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: data.post.likes.includes(userId),
      }));
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId 
            ? { ...post, likes: data.post.likes } 
            : post
        )
      );
    }
  } catch (err) {
    console.error("Error liking post:", err);
  }
};