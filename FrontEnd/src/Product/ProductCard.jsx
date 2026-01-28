import React from "react";
import { useNavigate } from "react-router-dom";
import { FiStar, FiPlus } from "react-icons/fi";
import { useCart } from "../Context/CartContext";

import { useDispatch, useSelector } from "react-redux";
import { addItemToWishlist, removeItemFromWishlist } from "../Redux/Auth/actions";

function ProductCard({ product, onQuickView }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addToWishlist: addToLocal } = useCart();
  const { user } = useSelector((store) => store.auth);

  const isWishlisted =
    user &&
    user.wishlist?.some((item) => {
      if (!item) return false;
      // Handle both populated object and ID string/ObjectId
      const itemId = item._id || item;
      return itemId.toString() === product._id?.toString();
    });

  const firstVariant = product.variants?.[0];
  const basePrice = firstVariant?.price || 0;
  const discount = product.discountedPercent || 0;
  const discountedPrice = Math.round(basePrice - (basePrice * discount) / 100);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (user) {
      if (isWishlisted) {
        dispatch(removeItemFromWishlist(product._id));
      } else {
        dispatch(addItemToWishlist(product._id));
      }
    } else {
      // If user is not logged in, redirect to login page
      navigate("/login");
    }
  };

  const handleQuickViewClick = (e) => {
    e.stopPropagation();
    onQuickView && onQuickView(product);
  };

  return (
    <div
      className="group cursor-pointer"
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
        {product.badge && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 font-bold rounded-sm z-10">
            {product.badge}
          </span>
        )}

        {/* Action Buttons (Wishlist & Quick View) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out">
          <button
            onClick={handleWishlistClick}
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
              isWishlisted
                ? "bg-black text-white"
                : "bg-white text-black hover:bg-black hover:text-white"
            }`}
            title="Add to Wishlist"
          >
            <FiStar size={18} className={isWishlisted ? "fill-current" : ""} />
          </button>
          <button
            onClick={handleQuickViewClick}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-md hover:bg-black hover:text-white transition-colors"
            title="Quick View"
          >
            <FiPlus size={18} />
          </button>
        </div>

        {/* Select Options Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${product.id}`);
          }}
          className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-[2px] hover:bg-black hover:text-white text-black py-2.5 text-sm font-medium rounded shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20"
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
                className="w-4 h-4 rounded-full border border-gray-300 transition-all group-hover/swatch:ring-1 group-hover/swatch:ring-offset-1 group-hover/swatch:ring-black cursor-pointer"
                style={{ backgroundColor: variant.hex }}
              ></div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 w-auto">
                {variant.color}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;