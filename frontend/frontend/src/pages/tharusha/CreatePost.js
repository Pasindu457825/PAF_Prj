import React, { useState } from "react";
import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig"; // Adjust the path as needed
import "./CreatePost.css";

function CreatePost() {
  // Basic fields for the post
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  // Separate states for images and videos
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  // UI feedback states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Track current step in the post creation process
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Preview states
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);
  const [videoPreviewUrls, setVideoPreviewUrls] = useState([]);

  // Handle input changes
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleHashtagsChange = (e) => {
    setHashtags(e.target.value);
  };

  // For image selection with preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previews);
  };

  // For video selection with preview
  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideoFiles(files);
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setVideoPreviewUrls(previews);
  };

  // Next step handler
  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step handler
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // 1) Convert comma-separated hashtags into an array
      const hashtagArray = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      // 2) Upload images to Firebase and collect URLs
      const imageUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `posts/images/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        imageUrls.push(downloadURL);
      }

      // 3) Upload videos to Firebase and collect URLs
      const videoUrls = [];
      for (const file of videoFiles) {
        const fileRef = ref(storage, `posts/videos/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        videoUrls.push(downloadURL);
      }

      // 4) Combine image and video URLs into one array for the backend
      const mediaUrls = [...imageUrls, ...videoUrls];

      // 5) Prepare the JSON data for your backend
      // Note: Do not send userId from the client. The backend will extract it from the session.
      const postData = {
        description,
        hashtags: hashtagArray,
        mediaUrls,
      };

      // 6) Send POST request to your backend with credentials enabled
      await axios.post("http://localhost:8080/api/posts", postData, {
        withCredentials: true, // ensures cookies are sent so the backend can identify the user
      });

      // 7) Clear form fields and show success message
      setDescription("");
      setHashtags("");
      setImageFiles([]);
      setVideoFiles([]);
      setImagePreviewUrls([]);
      setVideoPreviewUrls([]);
      setSuccess("Post created successfully!");
      setCurrentStep(1);
    } catch (err) {
      console.error("Failed to create post:", err);
      setError("Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  // Render step indicator
  const renderStepIndicator = () => {
    return (
      <div className="step-indicator">
        {[...Array(totalSteps)].map((_, index) => (
          <div 
            key={index} 
            className={`step ${currentStep > index + 1 ? 'completed' : ''} ${
              currentStep === index + 1 ? 'active' : ''
            }`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">
              {index === 0 && "Content"}
              {index === 1 && "Hashtags"}
              {index === 2 && "Media"}
              {index === 3 && "Review"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h2>Step 1: Create Your Content</h2>
            <p className="step-description">
              Write a detailed description for your skill share post. Be clear and engaging to attract your audience.
            </p>
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                placeholder="Share your knowledge, experience, or ask questions..."
                required
                rows={6}
              />
            </div>
            <div className="step-actions">
              <button 
                type="button" 
                className="next-button"
                onClick={handleNextStep}
                disabled={!description.trim()}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h2>Step 2: Add Relevant Hashtags</h2>
            <p className="step-description">
              Hashtags help categorize your post and make it discoverable. Add relevant hashtags separated by commas.
            </p>
            <div className="form-group">
              <label>Hashtags:</label>
              <input
                type="text"
                value={hashtags}
                onChange={handleHashtagsChange}
                placeholder="e.g., skills, programming, design, learning"
              />
            </div>
            {hashtags && (
              <div className="hashtag-preview">
                {hashtags
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
                  .map((tag, index) => (
                    <span key={index} className="hashtag-tag">
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
            <div className="step-actions">
              <button type="button" className="prev-button" onClick={handlePrevStep}>
                Previous
              </button>
              <button type="button" className="next-button" onClick={handleNextStep}>
                Next Step
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h2>Step 3: Upload Media</h2>
            <p className="step-description">
              Enhance your post with visual content. You can upload up to 3 images and short videos.
            </p>
            <div className="media-upload-container">
              <div className="form-group">
                <label>Images (max 3):</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    className="file-input"
                    max="3"
                  />
                  <label htmlFor="image-upload" className="file-input-label">
                    <span className="upload-icon">📷</span>
                    Choose Images
                  </label>
                </div>
                {imagePreviewUrls.length > 0 && (
                  <div className="preview-container">
                    <h4>Image Previews:</h4>
                    <div className="image-previews">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                          <img src={url} alt={`Preview ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Videos (max 30 secs each):</label>
                <div className="file-input-container">
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoChange}
                    id="video-upload"
                    className="file-input"
                  />
                  <label htmlFor="video-upload" className="file-input-label">
                    <span className="upload-icon">🎬</span>
                    Choose Videos
                  </label>
                </div>
                {videoPreviewUrls.length > 0 && (
                  <div className="preview-container">
                    <h4>Video Previews:</h4>
                    <div className="video-previews">
                      {videoPreviewUrls.map((url, index) => (
                        <div key={index} className="preview-item">
                          <video src={url} controls width="200" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="step-actions">
              <button type="button" className="prev-button" onClick={handlePrevStep}>
                Previous
              </button>
              <button type="button" className="next-button" onClick={handleNextStep}>
                Next Step
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h2>Step 4: Review and Submit</h2>
            <p className="step-description">
              Take a moment to review your post before sharing it with the community.
            </p>
            <div className="review-section">
              <div className="review-item">
                <h3>Content</h3>
                <p>{description || "No description provided."}</p>
              </div>
              <div className="review-item">
                <h3>Hashtags</h3>
                <div className="hashtag-preview">
                  {hashtags
                    ? hashtags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter((tag) => tag.length > 0)
                        .map((tag, index) => (
                          <span key={index} className="hashtag-tag">
                            #{tag}
                          </span>
                        ))
                    : "No hashtags provided."}
                </div>
              </div>
              <div className="review-item">
                <h3>Media</h3>
                <div className="media-review">
                  {imagePreviewUrls.length > 0 && (
                    <div className="image-review">
                      <h4>Images ({imagePreviewUrls.length})</h4>
                      <div className="image-previews">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="preview-item">
                            <img src={url} alt={`Preview ${index + 1}`} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {videoPreviewUrls.length > 0 && (
                    <div className="video-review">
                      <h4>Videos ({videoPreviewUrls.length})</h4>
                      <div className="video-previews">
                        {videoPreviewUrls.map((url, index) => (
                          <div key={index} className="preview-item">
                            <video src={url} controls width="200" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {imagePreviewUrls.length === 0 && videoPreviewUrls.length === 0 && (
                    <p>No media attached.</p>
                  )}
                </div>
              </div>
            </div>
            <div className="step-actions">
              <button type="button" className="prev-button" onClick={handlePrevStep}>
                Previous
              </button>
              <button 
                type="submit" 
                className="submit-button" 
                disabled={isLoading || !description.trim()}
              >
                {isLoading ? "Creating Post..." : "Publish Post"}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-post-container">
      <div className="post-header">
        <h1>Create a Skill Share Post</h1>
        <p className="subtitle">Share your knowledge with the community</p>
      </div>

      {error && (
        <div className="notification error">
          <span className="notification-icon">❌</span>
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="notification success">
          <span className="notification-icon">✅</span>
          <p>{success}</p>
        </div>
      )}

      {renderStepIndicator()}

      <form onSubmit={handleSubmit} className="post-form">
        {renderStepContent()}
      </form>
    </div>
  );
}

export default CreatePost;