import React, { useState } from "react";
import {
  MdClose,
  MdStar,
  MdStarBorder,
  MdAddPhotoAlternate,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { createReview } from "../Redux/Customers/Review/Action";
import { findProductById } from "../Redux/Customers/Product/action";

const RateProductModal = ({ open, handleClose, productId }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [headline, setHeadline] = useState("");
  const [images, setImages] = useState([]);
  const { user } = useSelector((store) => store.auth);
  const { error } = useSelector((store) => store.review);
  const [localError, setLocalError] = useState("");

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async () => {
    setLocalError("");
    const formData = new FormData();
    formData.append("productId", productId);
    formData.append("rating", rating);
    formData.append("comment", comment);
    formData.append("headline", headline);
    formData.append(
      "name",
      user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "User",
    );

    images.forEach((image) => {
      formData.append("images", image);
    });

    const success = await dispatch(createReview(formData));
    if (success) {
      dispatch(findProductById({ productId }));
      handleClose();
      setRating(0);
      setComment("");
      setHeadline("");
      setImages([]);
      setLocalError("");
    } else {
      // If store error update isn't immediate or we want to use the return value logic mainly:
      // We can also rely on the store error, but setting a local error trigger might be slightly faster for UI feedback loop if store update lags (rare in sync redux but good practice).
      // But actually, we need to read 'error' from store.
      // Let's just rely on the store 'error' being displayed.
    }
  };

  // Clear error when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setLocalError("");
      // Ideally we dispatch an action to clear review error in store too, but for now we just display what we have or rely on fresh error.
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Rate Product</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Rating Stars */}
          <div className="flex flex-col gap-2 items-center">
            <label className="text-sm font-medium text-gray-700">
              Your Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-yellow-400 hover:scale-110 transition-transform"
                >
                  {star <= rating ? (
                    <MdStar size={32} />
                  ) : (
                    <MdStarBorder size={32} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Headline Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="What's most important to know?"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          {/* Comment Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Review</label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Add Photos
            </label>
            <div className="flex gap-2 items-center">
              <label className="flex items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <MdAddPhotoAlternate size={24} className="text-gray-400" />
              </label>
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden shrink-0"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex flex-col gap-3 bg-gray-50">
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={rating === 0 || !comment}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateProductModal;