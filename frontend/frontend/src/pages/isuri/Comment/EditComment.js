import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditCommentForm from "./EditCommentForm";
import { ArrowLeft } from "lucide-react";

const EditComment = () => {
  const { commentId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      {/* Edit section card with gray background */}
      <div className="max-w-2xl mx-auto bg-gray-200 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
          ✏️ Edit Comment
        </h1>

        <EditCommentForm
          commentId={commentId}
          onClose={() => navigate("/comments")}
          onUpdated={() => console.log("Updated")}
        />

        {/* Back Button */}
        <div className="mt-6 text-right">
          <button
            onClick={() => navigate("/comments")}
            className="inline-flex items-center bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Comments
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditComment;
