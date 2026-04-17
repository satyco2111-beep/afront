"use client";

import { useEffect, useState } from "react";

export default function CommentsAndReviews({
  workId,
  workStatus,
  currentUserId,
  currentUserType,
  currentUserName,
  otherUserId,
  backendUrl,
}) {
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [commentText, setCommentText] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const isWorkComplete = workStatus === "done" || workStatus === "complete" || workStatus === "DONE" || workStatus === "COMPLETE";
  
  // Check if current user has already reviewed this work (users only)
  const userHasReviewed = reviews.some(
    (review) => review.authorId === currentUserId && review.authorType === "user"
  );
  
  // Check if current user is a user type (only users can review)
  const isUserType = currentUserType === "user";
  
  // Check if current user has already commented on this work (providers only)
  const providerHasCommented = comments.some(
    (comment) => comment.authorId === currentUserId && comment.authorType === "provider"
  );
  
  // Check if current user is a provider type (only providers can comment)
  const isProviderType = currentUserType === "provider";

  // Fetch comments and reviews
  useEffect(() => {
    if (!workId) return;

    async function loadData() {
      setLoadingComments(true);
      setLoadingReviews(true);

      try {
        const [commentsRes, reviewsRes] = await Promise.all([
          fetch(`${backendUrl}/api/comment/work/${workId}`),
          fetch(`${backendUrl}/api/review/work/${workId}`),
        ]);

        const commentsJson = await commentsRes.json();
        const reviewsJson = await reviewsRes.json();

        if (commentsJson.success) setComments(commentsJson.comments || []);
        if (reviewsJson.success) setReviews(reviewsJson.reviews || []);
      } catch (err) {
        console.error("Failed to load comments/reviews:", err);
      } finally {
        setLoadingComments(false);
        setLoadingReviews(false);
      }
    }

    loadData();
  }, [workId, backendUrl]);

  // Handle comment submission
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`${backendUrl}/api/comment/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: commentText,
          swrid: workId,
          authorId: currentUserId,
          authorType: currentUserType,
          authorName: currentUserName,
          receiverId: otherUserId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setCommentText("");
        alert("Comment added successfully");
      } else {
        alert(`Failed to add comment: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Failed to add comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  // Handle review submission
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await fetch(`${backendUrl}/api/review/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          review: reviewText,
          swrid: workId,
          rating: parseInt(reviewRating),
          authorId: currentUserId,
          authorType: currentUserType,
          authorName: currentUserName,
          receiverId: otherUserId,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviews([data.review, ...reviews]);
        setReviewText("");
        setReviewRating(5);
        alert("Review added successfully");
      } else {
        alert(`Failed to add review: ${data.message}`);
      }
    } catch (err) {
      console.error("Failed to add review:", err);
      alert("Failed to add review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {/* Comments Section */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-2xl font-semibold mb-4">Comments</h3>

        {!isWorkComplete && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
            Comments can be added after work is marked as complete.
          </div>
        )}

        {isWorkComplete && !isProviderType && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4">
            Only providers can submit comments on this work.
          </div>
        )}

        {isWorkComplete && isProviderType && providerHasCommented && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4">
            ✓ You have already commented on this work. Thank you for your feedback!
          </div>
        )}

        {isWorkComplete && isProviderType && !providerHasCommented && (
          <form onSubmit={handleAddComment} className="mb-6 p-4 bg-gray-50 rounded">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your feedback..."
              className="w-full rounded border px-3 py-2 mb-2"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
            >
              {submittingComment ? "Adding..." : "Add Comment"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {loadingComments ? (
            <p className="text-gray-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.scommentid} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex justify-between">
                  <strong className="text-gray-800">{comment.authorName}</strong>
                  <span className="text-xs text-gray-500">
                    {comment.authorType === "user" ? "User" : "Provider"}
                  </span>
                </div>
                <p className="text-gray-700 mt-2">{comment.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded shadow p-6">
        <h3 className="text-2xl font-semibold mb-4">Reviews & Ratings</h3>

        {!isWorkComplete && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded mb-4">
            Reviews can be added after work is marked as complete.
          </div>
        )}

        {isWorkComplete && !isUserType && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-2 rounded mb-4">
            Only users can submit reviews for this work.
          </div>
        )}

        {isWorkComplete && isUserType && userHasReviewed && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded mb-4">
            ✓ You have already reviewed this work. Thank you for your feedback!
          </div>
        )}

        {isWorkComplete && isUserType && !userHasReviewed && (
          <form onSubmit={handleAddReview} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Rating (1-5 stars)</label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(e.target.value)}
                className="w-full rounded border px-3 py-2"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars - Excellent</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars - Good</option>
                <option value="3">⭐⭐⭐ 3 Stars - Average</option>
                <option value="2">⭐⭐ 2 Stars - Poor</option>
                <option value="1">⭐ 1 Star - Very Poor</option>
              </select>
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your detailed review..."
              className="w-full rounded border px-3 py-2 mb-2"
              rows="3"
              required
            />
            <button
              type="submit"
              disabled={submittingReview || !reviewText.trim()}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50 transition"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {loadingReviews ? (
            <p className="text-gray-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            reviews.map((review) => (
              <div key={review.sreviewid} className="border rounded p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <strong className="text-gray-800">{review.authorName}</strong>
                    <span className="text-xs text-gray-500 ml-2">
                      ({review.authorType === "user" ? "User" : "Provider"})
                    </span>
                  </div>
                  <div className="text-lg">
                    {[...Array( review.rating)].map((_, i) => (
                      <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.review}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
