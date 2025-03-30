import React, { useState } from "react";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig"; // adjust path as needed
import "./CreatePost.css"; // optional styling

function CreatePost() {
  // Basic fields for the post
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Separate states for images and videos
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  // UI feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // -------------------------------
  // Handle input changes
  // -------------------------------
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleHashtagsChange = (e) => {
    setHashtags(e.target.value);
  };

  // For image selection
  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  // For video selection
  const handleVideoChange = (e) => {
    setVideoFiles(Array.from(e.target.files));
  };

  // -------------------------------
  // Submit Handler
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // 1) Convert comma-separated hashtags to an array
      const hashtagArray = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // 2) Upload images to Firebase
      const imageUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `posts/images/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        imageUrls.push(downloadURL);
      }

      // 3) Upload videos to Firebase
      const videoUrls = [];
      for (const file of videoFiles) {
        const fileRef = ref(storage, `posts/videos/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        videoUrls.push(downloadURL);
      }

      // 4) COMBINE image and video URLs into ONE array for the backend
      const mediaUrls = [...imageUrls, ...videoUrls];

      // 5) Prepare the JSON data for your backend
      const postData = {
        description,
        hashtags: hashtagArray,
        mediaUrls, // single array combining images & videos
      };

      // 6) Send POST request to your backend
      await axios.post("http://localhost:8080/api/posts", postData);

      // 7) Clear form & show success
      setDescription("");
      setHashtags("");
      setImageFiles([]);
      setVideoFiles([]);
      setSuccess("Post created successfully!");
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <h1>Create a New Post</h1>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <form onSubmit={handleSubmit} className="post-form">
        {/* Description */}
        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            required
          />
        </div>

        {/* Hashtags */}
        <div className="form-group">
          <label>Hashtags (comma separated):</label>
          <input
            type="text"
            value={hashtags}
            onChange={handleHashtagsChange}
          />
        </div>

        {/* Image Upload */}
        <div className="form-group">
          <label>Upload Images (max 3):</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Video Upload */}
        <div className="form-group">
          <label>Upload Videos (max 30 secs each):</label>
          <input
            type="file"
            multiple
            accept="video/*"
            onChange={handleVideoChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Creating Post..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
