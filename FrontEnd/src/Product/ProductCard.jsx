import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";

function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const { wishlistItems, addToWishlist, removeFromWishlist } = useCart();

  const isWishlisted = wishlistItems.some(
    (item) => item.id === product.id
  );

  const firstVariant = product.variants?.[0];
  const basePrice = firstVariant?.basePrice || 0;
  const discount = product.discountedPercent || 0;
  const discountedPrice = Math.round(
    basePrice - (basePrice * discount) / 100
  );
  const toggleWishlist = (e) => {
    e.stopPropagation();
    isWishlisted
      ? removeFromWishlist(product.id)
      : addToWishlist(product);
  };

  const handleQuickViewClick = (e) => {
  e.stopPropagation();
  onQuickView && onQuickView(product);
};

  return (
    <div
      className="group cursor-pointer relative isolate"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Container */}
      <div className="relative mb-3 overflow-hidden aspect-3/4">
        <img
          src={firstVariant?.images[0]}
          alt={product.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            firstVariant?.images[1]
              ? "group-hover:opacity-0 absolute inset-0"
              : "group-hover:scale-105"
          }`}
        />

        {firstVariant?.images[1] && (
          <img
            src={firstVariant.images[1]}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100"
          />
        )}

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold rounded-sm z-10">
            {product.badge}
          </span>
        )}

        {/* WISHLIST & QUICK VIEW (slide in from right) */}
        <div
          className="
            absolute top-3 right-3 z-20
            flex flex-col gap-3

            opacity-0
            translate-x-4

            group-hover:opacity-100
            group-hover:translate-x-0

            transition-all duration-300 ease-out
          "
          onClick={(e) => e.stopPropagation()}
        >
          {/* Wishlist */}
          <div className="relative group/tooltip">
            <button
              onClick={toggleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isWishlisted
                  ? "bg-black text-white"
                  : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill={isWishlisted ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499l2.122 4.299 4.747.689-3.434 3.346.811 4.73-4.246-2.233-4.246 2.233.811-4.73-3.434-3.346 4.747-.689 2.122-4.299z"
                />
              </svg>
            </button>

            {/* Tooltip */}
            <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap
              before:content-[''] before:absolute before:right-1.5 before:top-1/2 before:-translate-y-1/2 before:border-y-6 before:border-y-transparent before:border-l-6 before:border-l-black">
              {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            </span>
          </div>

          {/* Quick View */}
          <div className="relative group/tooltip">
            <button onClick={handleQuickViewClick} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 5v14M5 12h14"
                />
              </svg>
            </button>

            {/* Tooltip */}
            <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-3 py-2 rounded opacity-0 group-hover/tooltip:opacity-100 transition-all duration-300 whitespace-nowrap
              before:content-[''] before:absolute before:right-1.5 before:top-1/2 before:-translate-y-1/2 before:border-y-6 before:border-y-transparent before:border-l-6 before:border-l-black">
              Quick view
            </span>
          </div>
          
        </div>
        

        {/* Select Options */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-[2px] hover:bg-black hover:text-white text-black py-2.5 text-sm font-medium rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20"
        >
          Select options
        </button>
      </div>

      {/* Product Info */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-1 truncate">
          {product.title}
        </h3>

        <div className="flex items-center gap-2 text-sm mb-2">
          <span className="text-red-500 font-semibold">
            ₹ {discountedPrice.toLocaleString()}
          </span>
          <span className="text-gray-400 line-through text-xs">
            ₹ {basePrice.toLocaleString()}
          </span>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-2">
          {product.variants?.map((variant, index) => (
            <div key={index} className="relative group/swatch">
              <div
                className="w-6 h-6 rounded-full border border-gray-300 cursor-pointer group-hover/swatch:ring-1 group-hover/swatch:ring-black"
                style={{ backgroundColor: variant.hex }}
              ></div>

              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-[13px] rounded opacity-0 group-hover/swatch:opacity-100 whitespace-nowrap">
                {variant.color}
                {/* Arrow Downward */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;