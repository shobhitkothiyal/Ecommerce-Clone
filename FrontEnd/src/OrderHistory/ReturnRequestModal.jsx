import React, { useState } from "react";
import { MdClose, MdCloudUpload, MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { returnOrder } from "../Redux/Customers/Order/Action";

const ReturnRequestModal = ({ open, handleClose, orderId }) => {
  const dispatch = useDispatch();
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [requestType, setRequestType] = useState("RETURN");
  const [images, setImages] = useState([]); // Preview URLs (base64)
  const [imageFiles, setImageFiles] = useState([]); // Actual File objects

  const reasons = [
    "Manufacturing Defect",
    "Quality Concerns",
    "Wrong Item Received",
    "Damaged Product",
    "Size/Fit Issues",
    "Other",
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles((prev) => [...prev, ...files]);

    // Preview
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("returnReason", returnReason);
    formData.append("returnDescription", returnDescription);
    formData.append("returnRequestType", requestType);
    imageFiles.forEach((file) => {
      formData.append("returnImages", file);
    });

    dispatch(returnOrder(orderId, formData));
    handleClose();
    // Reset form
    setReturnReason("");
    setReturnDescription("");
    setRequestType("RETURN");
    setImages([]);
    setImageFiles([]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-fade-in relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Request Return
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Reason Select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Reason for Return
            </label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="" disabled>
                {" "}
                Select a reason{" "}
              </option>
              {reasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* Request Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="requestType"
                  value="RETURN"
                  checked={requestType === "RETURN"}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Return</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="requestType"
                  value="EXCHANGE"
                  checked={requestType === "EXCHANGE"}
                  onChange={(e) => setRequestType(e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Exchange</span>
              </label>
            </div>
          </div>

          {/* Description Textarea */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={returnDescription}
              onChange={(e) => setReturnDescription(e.target.value)}
              placeholder="Please describe the issue in detail..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
            />
          </div>

          {/* Image Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              accept="image/*"
              id="file-upload"
              multiple
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex flex-col items-center">
                <MdCloudUpload
                  size={28}
                  className="text-gray-400 group-hover:text-blue-500 transition-colors"
                />
                <span className="text-sm text-gray-500 group-hover:text-blue-600 font-medium">
                  Click to Upload
                </span>
              </div>
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="relative w-16 h-16 border border-gray-200 rounded-md overflow-hidden group"
                  >
                    <img
                      src={img}
                      alt="Return"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdDelete size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!returnReason || !returnDescription}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnRequestModal;