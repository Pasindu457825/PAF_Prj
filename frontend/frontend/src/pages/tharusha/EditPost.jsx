import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../../firebase/FirebaseConfig";
import { updatePost } from "./postService"; // or wherever your service is

function EditPost() {
  const { id } = useParams();  // /editpost/:id
  const navigate = useNavigate();

  // Post fields
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [existingMedia, setExistingMedia] = useState([]); // old media URLs
  const [removedMedia, setRemovedMedia] = useState([]);   // old media user wants to remove

  // New images & videos
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFiles, setVideoFiles] = useState([]);

  // UI feedback
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line
  }, [id]);

  // 1) Load the existing post from the backend
  const fetchPost = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/posts/${id}`, {
        withCredentials: true,
      });
      const post = res.data;
      setDescription(post.description || "");
      setHashtags((post.hashtags || []).join(", ")); // convert array -> comma string
      setExistingMedia(post.mediaUrls || []);        // store old media in array
    } catch (err) {
      console.error("Failed to fetch post:", err);
      setError("Failed to load post data.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2) Removing an existing media item
  //    We'll remove it from the UI so it doesn't get sent to final post,
  //    and optionally delete from Firebase.
  const handleRemoveOldMedia = async (url) => {
    // If you'd like to physically delete from Firebase here,
    // parse the path from the URL. For example:
    // const fileRef = ref(storage, `posts/images/${extractFileName(url)}`);
    // await deleteObject(fileRef);

    // We'll just remove from existingMedia so it's not included in final upload:
    setExistingMedia((prev) => prev.filter((m) => m !== url));
    // Optionally track them in a separate array if you want to do a delayed delete:
    setRemovedMedia((prev) => [...prev, url]);
  };

  // 3) Handle new file selection
  const handleImageChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };
  const handleVideoChange = (e) => {
    setVideoFiles(Array.from(e.target.files));
  };

  // 4) Submit updates
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Convert comma-separated hashtags into an array
      const hashtagArray = hashtags
        .split(",")
        .map((tag) => tag.trim())
        .filter((t) => t.length > 0);

      // (Optionally) delete removedMedia from Firebase here if you want to physically remove them
      // for (const url of removedMedia) {
      //   const fileRef = ref(storage, getStoragePathFromUrl(url));
      //   await deleteObject(fileRef);
      // }

      // 4a) Upload new images to Firebase
      const newImageUrls = [];
      for (const file of imageFiles) {
        const fileRef = ref(storage, `posts/images/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        newImageUrls.push(downloadURL);
      }

      // 4b) Upload new videos to Firebase
      const newVideoUrls = [];
      for (const file of videoFiles) {
        const fileRef = ref(storage, `posts/videos/${file.name}`);
        await uploadBytes(fileRef, file);
        const downloadURL = await getDownloadURL(fileRef);
        newVideoUrls.push(downloadURL);
      }

      // 4c) Combine old (kept) media with newly uploaded
      const finalMediaUrls = [...existingMedia, ...newImageUrls, ...newVideoUrls];

      // 4d) Build the updated post data
      const updatedData = {
        description,
        hashtags: hashtagArray,
        mediaUrls: finalMediaUrls,
      };

      // 4e) Send PUT request to your backend
      await updatePost(id, updatedData);

      // Clear form states
      setSuccess("Post updated successfully!");
      setImageFiles([]);
      setVideoFiles([]);
      setRemovedMedia([]);
      
      // Optionally navigate back to detail page
      // navigate(`/posts/${id}`);
    } catch (err) {
      console.error("Failed to update post:", err);
      setError("Failed to update post");
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading/error states
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading post data...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Render form
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Edit Post</h1>
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back
        </button>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              rows={4}
              placeholder="What's on your mind?"
            />
          </div>

          {/* Hashtags */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtags <span className="text-gray-400 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="travel, photography, nature"
            />
          </div>

          {/* Existing Media Preview + Remove Buttons */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Existing Media</h3>
            {existingMedia.length === 0 && (
              <p className="text-gray-500 text-sm italic">No existing media.</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {existingMedia.map((url) => (
                <div key={url} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    {url.match(/\.(mp4|mov|avi)$/i) ? (
                      <video 
                        src={url} 
                        controls 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt="Media" 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveOldMedia(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label="Remove media"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-4">Add New Media</h3>
            
            {/* Image Upload */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload images</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {imageFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {imageFiles.length} image{imageFiles.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>

            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Videos <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload videos</span>
                    </p>
                    <p className="text-xs text-gray-500">MP4, MOV up to 50MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                </label>
              </div>
              {videoFiles.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {videoFiles.length} video{videoFiles.length > 1 ? 's' : ''} selected
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelnow
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;