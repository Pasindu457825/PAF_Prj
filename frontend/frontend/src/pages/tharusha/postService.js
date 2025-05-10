// src/api/postService.js
import axiosInstance from "./axiosConfig";

/**
 * Get posts by user
 * GET /api/posts/user/{email}
 */
export const getPostsByUser = async (userEmail) => {
  const response = await axiosInstance.get(`/posts/user/${userEmail}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get a single post by ID
 * GET /api/posts/:id
 */
export const getPostById = async (postId) => {
  const response = await axiosInstance.get(`/posts/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Create a post (JSON version)
 * POST /api/posts
 */
export const createPost = async (postData) => {
  const response = await axiosInstance.post("/posts", postData, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Create a post with media (multipart)
 * POST /api/posts
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
 * POST /api/posts/:id/like
 */
export const likePost = async (postId, userId) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/like`,
    { userId },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

/**
 * Add a comment to a post
 * POST /api/posts/:id/comments
 */
export const addComment = async (postId, commentText) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/comments`,
    { commentText },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

/**
 * Edit a comment
 * PUT /api/posts/:postId/comments/:commentId
 */
export const updateComment = async (postId, commentId, commentText) => {
  const response = await axiosInstance.put(
    `/posts/${postId}/comments/${commentId}`,
    { commentText },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data;
};

/**
 * Delete a comment
 * DELETE /api/posts/:postId/comments/:commentId
 */
export const deleteComment = async (postId, commentId) => {
  const response = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`,
    { withCredentials: true }
  );
  return response.data;
};

/**
 * Delete a post
 * DELETE /api/posts/:id
 */
export const deletePost = async (postId) => {
  const response = await axiosInstance.delete(`/posts/${postId}`, {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Get all posts
 * GET /api/posts
 */
export const getAllPosts = async () => {
  const response = await axiosInstance.get("/posts", {
    withCredentials: true,
  });
  return response.data;
};

/**
 * Update a post
 * PUT /api/posts/:id
 */
export const updatePost = async (postId, updatedPostData) => {
  const response = await axiosInstance.put(
    `/posts/${postId}`,
    updatedPostData,
    { withCredentials: true }
  );
  return response.data;
};
