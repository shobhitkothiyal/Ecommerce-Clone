// src/components/AddProductForm.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createProduct,
  updateProduct,
} from "../Redux/Customers/Product/Action";
import categoryHierarchy from "../data/categoryHierarchi";

const AddProductForm = ({ readOnly = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productToUpdate = location?.state?.product || null;

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [variantType, setVariantType] = useState("single");

  const [singleHex, setSingleHex] = useState("#000000");

  const [dualColor1, setDualColor1] = useState("#000000");
  const [dualColor2, setDualColor2] = useState("#ffffff");


  // ... (maintain existing state: formData, variants)

  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    brand: "",
    description: "",
    price: "",
    discountedPrice: "",
    discountPercentage: "",
    topLevelCategory: "",
    secondLevelCategory: "",
    thirdLevelCategory: "",
    details: [{ key: "", value: "" }],
  });

  // Main Image State
  const [mainImage, setMainImage] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");

  const [variants, setVariants] = useState([
    {
      color: "",
      colors: ["#000000", "#ffffff"],
      basePrice: "",
      files: [],
      previews: [],
      stock: [
        { size: "XS", quantity: 0 },
        { size: "S", quantity: 0 },
        { size: "M", quantity: 0 },
        { size: "L", quantity: 0 },
        { size: "XL", quantity: 0 },
        { size: "XXL", quantity: 0 },
      ],
    },
  ]);

  const isEditing = !!formData._id;

  // Initialize form if editing
  useEffect(() => {
    if (productToUpdate) {
      // Map existing data to state
      setFormData({
        _id: productToUpdate._id,
        title: productToUpdate.title || "",
        brand: productToUpdate.brand || "",
        description: productToUpdate.description || "",
        price: productToUpdate.price || "",
        discountedPrice: productToUpdate.discountedPrice || "",
        discountPercentage: productToUpdate.discountedPercent || "",
        topLevelCategory: productToUpdate.topLevelCategory || "",
        secondLevelCategory: productToUpdate.secondLevelCategory || "",
        thirdLevelCategory:
          productToUpdate.thirdLevelCategory ||
          productToUpdate.category?.name ||
          productToUpdate.category ||
          "",
        details: Array.isArray(productToUpdate.details)
          ? productToUpdate.details.map((d) => ({
            key: d.key || "",
            value: d.value || "",
          }))
          : [{ key: "", value: "" }],
      });

      // Set Main Image Preview if exists
      if (productToUpdate.images && productToUpdate.images.length > 0) {
        // Assuming images is an array of strings
        setMainImagePreview(productToUpdate.images[0]);
      } else if (typeof productToUpdate.imageUrl === "string") {
        setMainImagePreview(productToUpdate.imageUrl);
      }

      if (productToUpdate.variants && productToUpdate.variants.length > 0) {
        const mappedVariants = productToUpdate.variants.map((v) => {
          const stockArray = Object.entries(v.stock || {}).map(
            ([size, quantity]) => ({ size, quantity })
          );

          return {
            color: v.color || "",
            hex: v.hex || "#000000",
            colors:
              Array.isArray(v.colors) && v.colors.length === 2
                ? v.colors
                : [],
            basePrice: v.price || "",
            files: [],
            previews: v.images || [],
            stock:
              stockArray.length > 0
                ? stockArray
                : [
                  { size: "XS", quantity: 0 },
                  { size: "S", quantity: 0 },
                  { size: "M", quantity: 0 },
                  { size: "L", quantity: 0 },
                  { size: "XL", quantity: 0 },
                  { size: "XXL", quantity: 0 },
                ],
          };
        });

        setVariants(mappedVariants);
      }

    }
  }, [productToUpdate]);

  // Handle Input Change for Top Level
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("detail-")) {
      const index = parseInt(name.split("-")[1], 10);
      const field = name.split("-")[2]; // "key" or "value"
      const updatedDetails = [...formData.details];
      updatedDetails[index][field] = value;
      setFormData((prev) => ({ ...prev, details: updatedDetails }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Main Image Handler
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
    }
  };

  // --- Variant Handlers ---
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        hex: "#000000",
        colors: ["#000000", "#ffffff"],
        basePrice: formData.discountedPrice || "", // Default to main price
        files: [],
        previews: [],
        stock: [
          { size: "XS", quantity: 0 },
          { size: "S", quantity: 0 },
          { size: "M", quantity: 0 },
          { size: "L", quantity: 0 },
          { size: "XL", quantity: 0 },
          { size: "XXL", quantity: 0 },
        ],
      },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      alert("At least one variant is required.");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const handleVariantFileChange = (index, e) => {
    const files = Array.from(e.target.files);
    const updated = [...variants];

    // Append new files to existing ones
    const existingFiles = updated[index].files || [];
    const existingPreviews = updated[index].previews || [];

    updated[index].files = [...existingFiles, ...files];
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    updated[index].previews = [...existingPreviews, ...newPreviews];

    setVariants(updated);

    // Reset inputs value to allow selecting same file again if needed
    e.target.value = "";
  };

  const handleSetMainVariantImage = (vIndex, imgIndex) => {
    const updated = [...variants];
    const variant = updated[vIndex];

    // Swap files
    if (variant.files && variant.files.length > imgIndex) {
      const file = variant.files[imgIndex];
      const newFiles = [...variant.files];
      newFiles.splice(imgIndex, 1);
      newFiles.unshift(file);
      variant.files = newFiles;
    }

    // Swap previews
    if (variant.previews && variant.previews.length > imgIndex) {
      const preview = variant.previews[imgIndex];
      const newPreviews = [...variant.previews];
      newPreviews.splice(imgIndex, 1);
      newPreviews.unshift(preview);
      variant.previews = newPreviews;
    }

    setVariants(updated);
  };

  const handleDeleteVariantImage = (vIndex, imgIndex) => {
    const updated = [...variants];
    const variant = updated[vIndex];

    // Remove from files
    if (variant.files && variant.files.length > imgIndex) {
      variant.files.splice(imgIndex, 1);
    }

    // Remove from previews
    if (variant.previews && variant.previews.length > imgIndex) {
      // Revoke object URL to avoid memory leaks if it's a blob
      const url = variant.previews[imgIndex];
      if (typeof url === "string" && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
      variant.previews.splice(imgIndex, 1);
    }

    setVariants(updated);
  };

  // Stock Management for Variant
  const addStockRow = (vIndex) => {
    const updated = [...variants];
    updated[vIndex].stock.push({ size: "", quantity: 0 });
    setVariants(updated);
  };

  const removeStockRow = (vIndex, sIndex) => {
    const updated = [...variants];
    updated[vIndex].stock = updated[vIndex].stock.filter(
      (_, i) => i !== sIndex,
    );
    setVariants(updated);
  };

  const handleStockChange = (vIndex, sIndex, field, value) => {
    const updated = [...variants];
    updated[vIndex].stock[sIndex][field] = value;
    setVariants(updated);
  };

  // Category Logic
  const secondLevelOptions = formData.topLevelCategory
    ? categoryHierarchy?.[formData.topLevelCategory] || []
    : [];

  const thirdLevelOptions = [];

  // Calculate Discount
  useEffect(() => {
    const p = Number(formData.price);
    const dp = Number(formData.discountedPrice);
    if (p > 0 && dp > 0) {
      const percent = Math.round(((p - dp) / p) * 100);
      setFormData((prev) => ({ ...prev, discountPercentage: percent }));
    }
  }, [formData.price, formData.discountedPrice]);

  // Submit Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      // --- VALIDATION START ---
      const missingFields = [];
      if (!formData.title) missingFields.push("Title");
      if (!formData.description) missingFields.push("Description");
      if (!formData.price) missingFields.push("Original Price");
      if (!formData.topLevelCategory) missingFields.push("Top Level Category");
      if (!formData.secondLevelCategory)
        missingFields.push("Second Level Category");

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Check Variants for Color
      const invalidVariantColor = variants.some(
        (v) => !v.color || v.color.trim() === "",
      );
      if (invalidVariantColor) {
        throw new Error("All variants must have a Color Name.");
      }
      // --- VALIDATION END ---

      const payload = new FormData();

      // 1. Basic Fields
      payload.append("title", formData.title);
      payload.append("brand", formData.brand);
      payload.append("description", formData.description);

      // Use price/discountedPrice as Root Price
      if (formData.price) payload.append("price", formData.price);
      if (formData.discountedPrice)
        payload.append("discountedPrice", formData.discountedPrice);

      payload.append("discountedPercent", formData.discountPercentage);
      payload.append("quantity", 0); // Aggregate quantity later if needed
      payload.append(
        "category",
        formData.thirdLevelCategory || formData.secondLevelCategory || "",
      );
      payload.append("topLevelCategory", formData.topLevelCategory || "");
      payload.append("secondLevelCategory", formData.secondLevelCategory || "");
      payload.append("thirdLevelCategory", formData.thirdLevelCategory || "");

      // Append Details
      const cleanedDetails = formData.details.filter(
        (d) => d.key && d.key.trim() !== "",
      );

      payload.append("details", JSON.stringify(cleanedDetails));

      // 2. Main Images
      if (mainImage) {
        payload.append("images", mainImage);
      } else if (isEditing && mainImagePreview) {
        // If editing and no new file selected, we might want to preserve existing.
        // The backend logic checks for `existingImageUrls` or we can just not send `images`.
        // However, if we want to BE EXPLICIT about current images, we should send them?
        // Current backend controller: "if (req.files && req.files.length > 0) ... mainImages = ... if (mainImages.length > 0) ..."
        // It seems if we don't send NEW files, it might preserve or we need to handle "existingImageUrls".
        // Let's pass existing image URL as a string if no new file is there, blindly?
        // No, typically file inputs are for NEW files.
        // If we want to keep existing, we might need to send `existingImageUrls`.
        // Let's check `product.controller.js` again. It reads `productData.existingImageUrls`.
        // So let's append that.
        payload.append("existingImageUrls", JSON.stringify([mainImagePreview]));
      }

      // VALIDATION
      // Ensure we have a main image (either new one or existing one)
      if (!mainImage && !mainImagePreview) {
        // Optionally make main image mandatory?
        // throw new Error("Main Product Image is required.");
      }

      if (variants.length === 0) {
        throw new Error("At least one variant is required.");
      }

      // Check if at least one variant has images (either new files or existing previews)
      const hasImages = variants.some(
        (v) =>
          (v.files && v.files.length > 0) ||
          (v.previews && v.previews.length > 0),
      );
      if (!hasImages) {
        throw new Error("At least one product variant must have images.");
      }

      // Check if at least one price source exists (Global Price OR Variant Price)
      const globalPrice =
        Number(formData.price) || Number(formData.discountedPrice);
      const hasVariantPrice = variants.some(
        (v) => v.basePrice && Number(v.basePrice) > 0,
      );

      // If no global price, EVERY variant must have a price? Or just at least one?
      // User said: "if i dont give price to variants the price for the main product will be considered"
      // Implies: If Global Price exists, Variant Price is optional.
      // If Global Price DOES NOT exist, specific Variant Price is MANDATORY for that variant?
      // Let's enforce: Either Global Price > 0 OR (All variants have prices? Or just one?)
      // Simplest safe rule: If Global Price is 0/Empty, then ALL variants must have a price.
      // Actually strictly: We need at least one valid price path.

      // If Global Price is missing, we must ensure every variant has a price (since they can't inherit).
      if (!globalPrice || globalPrice <= 0) {
        const allVariantsHavePrice = variants.every(
          (v) => v.basePrice && Number(v.basePrice) > 0,
        );
        if (!allVariantsHavePrice) {
          throw new Error(
            "If no global/main price is set, ALL variants must have a specific price.",
          );
        }
      }

      // 3. Variants
      const variantsData = variants.map((v) => {

        const colorsArray =
          Array.isArray(v.colors) && v.colors.length > 0
            ? v.colors
            : (v.hex ? [v.hex] : ["#000000"]);

        // Convert stock array to Map-like object for backend
        const stockMap = {};
        v.stock.forEach((item) => {
          if (item.size) stockMap[item.size] = Number(item.quantity) || 0;
        });

        // Determine effective price for this variant
        // We just send what we have.
        // FILTER EXISTING IMAGES (Strings) from previews to preserve them
        const existingImages = (v.previews || []).filter(
          (url) => typeof url === "string" && !url.startsWith("blob:"),
        );

        return {
          color: v.color,
          colors: colorsArray,
          hex: v.hex || "",
          price: Number(v.basePrice) || 0,
          stock: stockMap,
          images: existingImages, // Send existing images to backend
        };
      });

      payload.append("variants", JSON.stringify(variantsData));

      // 4. Variant Images
      variants.forEach((v, index) => {
        if (v.files && v.files.length > 0) {
          v.files.forEach((f) => {
            payload.append(`variantImages_${index}`, f);
          });
        }
      });

      if (isEditing) {
        payload.append("productId", formData._id);
        await dispatch(updateProduct(payload));
        setSuccessMessage("Product Updated!");
      } else {
        await dispatch(createProduct(payload));
        setSuccessMessage("Product Created Successfully!");

        // Reset
        setFormData({
          _id: null,
          title: "",
          brand: "",
          description: "",
          price: "",
          discountedPrice: "",
          discountPercentage: "",
          topLevelCategory: "",
          secondLevelCategory: "",
          thirdLevelCategory: "",
          details: [{ key: "", value: "" }],
        });

        setVariants([
          {
            color: "",
            colors: ["#000000"],
            basePrice: "",
            files: [],
            previews: [],
            stock: [{ size: "S", quantity: 0 }],
          },
        ]);
      }
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setSuccessMessage(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  // Edit Handler
  const handleEdit = () => {
    // Navigate to update page with the current product data
    // We can reconstruction the product object or pass what we have
    // If productToUpdate is available from location, pass it.
    // Or pass the formData + variants which we have in state.
    // Ideally update page expects the full product object structure.
    // Let's rely on productToUpdate if available, or construct basic one.
    if (productToUpdate) {
      navigate("/admin/update-product", {
        state: { product: productToUpdate },
      });
    }
  };
  // Color Handler  
  const [colors, setColors] = useState([
    { primary: "", secondary: "" }
  ]);
  const handleColorChange = (index, field, value) => {
    const updated = [...colors];
    updated[index][field] = value;
    setColors(updated);
  };
  return (
    <div className="max-w-7xl mx-auto p-6 bg-zinc-950 min-h-screen text-gray-200">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {readOnly
          ? "Product Details"
          : isEditing
            ? "Update Product"
            : "Add New Product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* --- Global Details Section --- */}
        <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">
            Basic Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Product Title
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none transition disabled:opacity-50"
                placeholder="e.g. Mens Cotton Jacket"
                required
                disabled={readOnly}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">Brand</label>
              <input
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none transition disabled:opacity-50"
                placeholder="e.g. Nike"
                disabled={readOnly}
              />
            </div>


            <div className="md:col-span-2">
              <label className="block text-sm mb-2 text-gray-400">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 focus:border-indigo-500 outline-none transition disabled:opacity-50"
                disabled={readOnly}
                required
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <select
              name="topLevelCategory"
              value={formData.topLevelCategory}
              onChange={handleInputChange}
              className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
              disabled={readOnly}
              required
            >
              <option value="">-- Top Category --</option>
              {Object.keys(categoryHierarchy || {}).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>

            <select
              name="secondLevelCategory"
              value={formData.secondLevelCategory}
              onChange={handleInputChange}
              disabled={readOnly || !secondLevelOptions.length}
              className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
              required
            >
              <option value="">-- Sub Category --</option>
              {secondLevelOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Global Pricing */}
          <div className="grid grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Original Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
                disabled={readOnly}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Discounted Price
              </label>
              <input
                name="discountedPrice"
                type="number"
                value={formData.discountedPrice}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
                disabled={readOnly}
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-400">
                Discount %
              </label>
              <input
                value={formData.discountPercentage}
                readOnly
                className="w-full bg-zinc-800 border-zinc-700 border rounded-lg px-4 py-3 text-zinc-400 cursor-not-allowed"
              />
            </div>
          </div>
        </section>

        {/* --- Product Details Section --- */}
        <section className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
          <h2 className="text-xl font-semibold mb-6 text-indigo-400">
            Product Details
          </h2>
          <div className="space-y-4">
            {formData.details.map((detail, index) => (
              <div key={index} className="flex gap-4 items-center">
                <input
                  name={`detail-${index}-key`}
                  value={detail.key}
                  onChange={handleInputChange}
                  placeholder="Heading (e.g. Fabric)"
                  className="w-1/3 bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
                  disabled={readOnly}
                />
                <input
                  name={`detail-${index}-value`}
                  value={detail.value}
                  onChange={handleInputChange}
                  placeholder="Value (e.g. Cotton)"
                  className="w-full bg-black/50 border border-zinc-700 rounded-lg px-4 py-3 disabled:opacity-50"
                  disabled={readOnly}
                />

                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.details.filter(
                        (_, i) => i !== index,
                      );
                      setFormData({ ...formData, details: updated });
                    }}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
            {!readOnly && (
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    details: [...formData.details, { key: "", value: "" }],
                  })
                }
                className="text-sm bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700"
              >
                + Add Detail
              </button>
            )}
          </div>
        </section>

        {/* --- Variants Section --- */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex justify-between items-center">
            Variants
            {!readOnly && (
              <button
                type="button"
                onClick={addVariant}
                className="text-sm bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200 transition font-bold"
              >
                + Add Variant
              </button>
            )}
          </h2>

          {variants.map((variant, vIndex) => (
            <div
              key={vIndex}
              className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 relative"
            >
              {!readOnly && variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(vIndex)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-400 font-bold"
                >
                  Remove
                </button>
              )}

              <h3 className="text-lg font-semibold mb-4 text-gray-300">
                Variant #{vIndex + 1}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm mb-1 text-gray-400">
                    Color Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={variant.color}
                    onChange={(e) =>
                      handleVariantChange(vIndex, "color", e.target.value)
                    }
                    placeholder="Red, Blue, Black and White...."
                    className="w-full bg-black/50 border border-zinc-700 rounded px-3 py-2 disabled:opacity-50"
                    disabled={readOnly}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-gray-400">
                    Color Type
                  </label>

                  <select
                    value={
                      Array.isArray(variant.colors) && variant.colors.length === 2
                        ? "dual"
                        : "single"
                    }
                    onChange={(e) => {
                      const updated = [...variants];

                      if (e.target.value === "dual") {
                        // switch to dual color
                        updated[vIndex].colors = ["#000000", "#ffffff"];
                        updated[vIndex].hex = ""; // IMPORTANT
                      } else {
                        // switch to single color
                        updated[vIndex].hex = "#000000";
                        updated[vIndex].colors = []; // IMPORTANT
                      }

                      setVariants(updated);
                    }}
                    className="w-full bg-black/50 border border-zinc-700 rounded px-3 py-2"
                    disabled={readOnly}
                  >
                    <option value="single">Single Color</option>
                    <option value="dual">Dual Color</option>
                  </select>

                  {/* COLOR PICKERS */}
                  <div className="flex gap-3 mt-3">
                    {Array.isArray(variant.colors) && variant.colors.length === 2 ? (
                      // DUAL COLOR PICKERS
                      variant.colors.map((c, i) => (
                        <input
                          key={i}
                          type="color"
                          value={c}
                          onChange={(e) => {
                            const updated = [...variants];
                            updated[vIndex].colors[i] = e.target.value;
                            setVariants(updated);
                          }}
                          className="h-10 w-14 cursor-pointer rounded border border-zinc-600"
                          disabled={readOnly}
                        />
                      ))
                    ) : (
                      // SINGLE COLOR PICKER
                      <input
                        type="color"
                        value={variant.hex || "#000000"}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[vIndex].hex = e.target.value;
                          setVariants(updated);
                        }}
                        className="h-10 w-14 cursor-pointer rounded border border-zinc-600"
                        disabled={readOnly}
                      />
                    )}
                  </div>
                </div>


                <div>
                  <label className="block text-sm mb-1 text-gray-400">
                    Variant Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={variant.basePrice}
                    onChange={(e) =>
                      handleVariantChange(vIndex, "basePrice", e.target.value)
                    }
                    placeholder="Override base price"
                    className="w-full bg-black/50 border border-zinc-700 rounded px-3 py-2 disabled:opacity-50"
                    disabled={readOnly}
                  />
                </div>
              </div>

              {/* Variant Images */}
              <div className="mb-6">
                <label className="block text-sm mb-2 text-gray-400">
                  Variant Images
                </label>
                {!readOnly && (
                  <>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleVariantFileChange(vIndex, e)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-1">Select multiple files. Click again to add more.</p>
                  </>
                )}
                <div className="flex gap-3 mt-3 flex-wrap">
                  {variant.previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        className={`w-20 h-20 object-cover rounded border-2 ${i === 0 ? "border-indigo-500" : "border-zinc-600"
                          }`}
                        alt="var"
                      />
                      {i === 0 && (
                        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] px-1 rounded-br">
                          Main
                        </div>
                      )}
                      {!readOnly && (
                        <>
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteVariantImage(vIndex, i)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            title="Remove Image"
                          >
                            ×
                          </button>

                          {/* Set as Main Overlay (skip for first item) */}
                          {i !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetMainVariantImage(vIndex, i)}
                              className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-bold transition-opacity rounded"
                            >
                              Set as Main
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock Grid */}
              <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="text-sm font-semibold mb-3 text-gray-400">
                  Size & Stock
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {variant.stock.map((stk, sIndex) => (
                    <div key={sIndex} className="flex gap-2 items-center">
                      <input
                        placeholder="Size (S, M...)"
                        value={stk.size}
                        onChange={(e) =>
                          handleStockChange(
                            vIndex,
                            sIndex,
                            "size",
                            e.target.value,
                          )
                        }
                        className="w-20 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-center disabled:opacity-50"
                        disabled={readOnly}
                      />
                      <input
                        type="number"
                        placeholder="Qty"
                        value={stk.quantity}
                        onChange={(e) =>
                          handleStockChange(
                            vIndex,
                            sIndex,
                            "quantity",
                            e.target.value,
                          )
                        }
                        className="w-20 bg-zinc-800 border border-zinc-600 rounded px-2 py-1 text-center disabled:opacity-50"
                        disabled={readOnly}
                      />
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => removeStockRow(vIndex, sIndex)}
                          className="text-zinc-500 hover:text-red-500"
                        >
                          x
                        </button>
                      )}
                    </div>
                  ))}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => addStockRow(vIndex)}
                      className="text-xs border border-zinc-600 text-zinc-400 px-3 py-1 rounded hover:bg-zinc-800"
                    >
                      + Add Size
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="fixed bottom-6 right-6 flex gap-4">
          {success && (
            <div className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce">
              {successMessage}
            </div>
          )}

          {readOnly ? (
            <button
              type="button"
              onClick={handleEdit}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition transform hover:scale-105"
            >
              Edit Product
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full shadow-2xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Processing..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AddProductForm;