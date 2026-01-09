import React, { useState, useRef } from "react";
import {
  FiX,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Import Pagination
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; // Import Pagination CSS
import { useCart } from "../Context/CartContext";

function QuickViewModal({ product, onClose }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const swiperRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color || ""
  );
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Find the currently selected variant object based on color
  const currentVariant =
    product.variants?.find((v) => v.color === selectedColor) ||
    product.variants?.[0];

  // Get available sizes for the selected variant
  const availableSizes = currentVariant?.stock
    ? Object.keys(currentVariant.stock).filter(
        (size) => currentVariant.stock[size] > 0
      )
    : [];

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(product, currentVariant, selectedSize, quantity);
    onClose();
  };

  if (!product) return null;

  const basePrice = currentVariant?.basePrice || 0;
  const discount = product.discountedPercent || 0;
  const discountedPrice = Math.round(basePrice - (basePrice * discount) / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden rounded-lg shadow-2xl flex flex-col md:flex-row animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <FiX size={24} />
        </button>

        {/* Left Side - Image Slider (Full Bleed) */}
        <div className="w-full md:w-1/2 bg-gray-100 relative group h-[50vh] md:h-auto">
          <Swiper
            key={selectedColor} // Reset swiper when color changes
            modules={[Navigation, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            pagination={{ clickable: true }} // Add pagination
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full h-full"
          >
            {currentVariant?.images?.map((img, index) => (
              <SwiperSlide key={index}>
                <img
                  src={img}
                  alt={`${product.title} - ${selectedColor}`}
                  className="w-full h-full object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation Arrows */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-1/2 left-4 z-20 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          >
            <FiArrowLeft size={20} />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-1/2 right-4 z-20 -translate-y-1/2 bg-white/80 hover:bg-white text-black p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-50"
          >
            <FiArrowRight size={20} />
          </button>
        </div>

        {/* Right Side - Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
          <h2 className="text-2xl font-serif font-medium mb-2 pr-8">
            {product.title}
          </h2>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-xl font-bold text-red-500">
              ₹ {discountedPrice.toLocaleString()}
            </span>
            <span className="text-gray-400 line-through">
              ₹ {basePrice.toLocaleString()}
            </span>
          </div>

          <p className="text-gray-600 text-sm mb-2 leading-relaxed line-clamp-3">
            {product.description}
          </p>
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="text-black underline text-sm font-medium mb-6 hover:text-gray-600 w-fit"
          >
            View details
          </button>

          {/* Size Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">
              Size: <span className="text-gray-500">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(currentVariant?.stock || {}).map((size) => {
                const isAvailable = currentVariant.stock[size] > 0;
                return (
                  <button
                    key={size}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && setSelectedSize(size)}
                    className={`min-w-12 h-12 px-3 border rounded-full text-sm flex items-center justify-center transition-all ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : isAvailable
                        ? "bg-white text-gray-700 border-gray-300 hover:border-black"
                        : "bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed box-decoration-slice"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Selector */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">
              Color: <span className="text-gray-500">{selectedColor}</span>
            </p>

            <div className="flex flex-wrap gap-3">
              {product.variants?.map((variant) => (
                <div key={variant.color} className="relative group">
                  <button
                    onClick={() => {
                      setSelectedColor(variant.color);
                      setSelectedSize(""); // Reset size on color change
                    }}
                    className={`w-8 h-8 rounded-full border border-gray-200 shadow-sm transition-all hover:scale-110 ${
                      selectedColor === variant.color
                        ? "ring-2 ring-black ring-offset-2"
                        : ""
                    }`}
                    style={{ backgroundColor: variant.hex }}
                  />

                  {/* Tooltip */}
                  <div
                    className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-4 py-2 bg-black text-white text-xs rounded
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            whitespace-nowrap z-20
          "
                  >
                    {variant.color}

                    {/* Arrow */}
                    <div
                      className="
              absolute top-full left-1/2 -translate-x-1/2
              w-0 h-0
              border-l-4 border-r-4 border-t-4
              border-l-transparent border-r-transparent border-t-black
            "
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="">
            <p className="text-sm font-medium mb-2">Quantity</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={handleDecreaseQty}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-10 text-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={handleIncreaseQty}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className="flex-1 bg-black text-white py-3 px-6 rounded-md font-medium uppercase text-sm tracking-wide hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {selectedSize ? "ADD TO BAG" : "SELECT SIZE"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
