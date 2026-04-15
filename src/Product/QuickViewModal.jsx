import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../Redux/Customers/Cart/action";

function QuickViewModal({ product, onClose }) {
  const navigate = useNavigate();
  const { addToCart, setIsCartOpen } = useCart();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((store) => store.cart);
  const swiperRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState(
    product.variants?.[0]?.color || "",
  );

  // Helper to get available sizes for a variant
  const getAvailableSizes = (variant) => {
    if (!variant?.stock) return [];
    return Object.keys(variant.stock).filter((size) => variant.stock[size] > 0);
  };

  const [selectedSize, setSelectedSize] = useState(() => {
    const initialVariant =
      product.variants?.find(
        (v) => v.color === (product.variants?.[0]?.color || ""),
      ) || product.variants?.[0];
    const sizes = getAvailableSizes(initialVariant);
    return sizes.length > 0 ? sizes[0] : "";
  });
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState("");
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState({ type: "", message: "" });
  const [isCopied, setIsCopied] = useState(false);

  // Find the currently selected variant object based on color
  const currentVariant =
    product.variants?.find((v) => v.color === selectedColor) ||
    product.variants?.[0];

  // Get available sizes for the selected variant
  const availableSizes = currentVariant?.stock
    ? Object.keys(currentVariant.stock).filter(
      (size) => currentVariant.stock[size] > 0,
    )
    : [];

  const currentAvailableStock = (() => {
    const stockData = currentVariant?.stock;
    return stockData instanceof Map
      ? Number(stockData.get(selectedSize))
      : Number(stockData?.[selectedSize] ?? 0);
  })();

  const quantityInCart = (cartItems || []).find(
    (item) =>
      item.product?._id === (product?._id || product?.id) &&
      item.size === selectedSize &&
      (item.variant?.color === selectedColor || item.color === selectedColor)
  )?.quantity || 0;

  const handleDecreaseQty = () => {
    setQuantityError("");
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQty = () => {
    const remainingStock = currentAvailableStock - quantityInCart;
    if (quantity < remainingStock) {
      setQuantity(quantity + 1);
      setQuantityError("");
    } else {
      setQuantityError(
        "The maximum Quantity of this item is already placed in your cart"
      );
    }
  };

  const handleAddToCart = () => {
    // Dispatch Redux action
    const reqData = {
      productId: product._id || product.id, // Ensure correct ID field
      size: selectedSize,
      quantity: Math.min(quantity, currentAvailableStock - quantityInCart),
      variant: currentVariant,
    };
    dispatch(addItemToCart(reqData));

    // Also update UI context if needed to open drawer
    // The Redux success usually triggers a cart fetch.
    // If context 'isCartOpen' depends on local state, we might need to set it.
    // CartDrawer uses 'useCart().setIsCartOpen(true)' typically to show itself?
    // Let's assume dispatching action is enough for data.
    // But to OPEN the drawer:
    setIsCartOpen(true);
    onClose();
  };

  const handleNotifySubmit = async (e) => {
    e.preventDefault();
    if (!notifyEmail) return;

    setIsNotifying(true);
    setNotifyStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api"}/stock-notifications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id || product.id,
          color: selectedColor,
          size: selectedSize,
          email: notifyEmail,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setNotifyStatus({ type: "success", message: "Success! You've followed this item 🎉" });
      } else {
        setNotifyStatus({ type: "error", message: data.error || "Something went wrong." });
      }
    } catch (error) {
      setNotifyStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsNotifying(false);
    }
  };

  if (!product) return null;

  const basePrice = currentVariant?.price || 0; // Fix: use .price not .basePrice
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
                const stockQty = currentVariant.stock[size];
                const isAvailable = stockQty > 0;
                return (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      setQuantity(1);
                      setQuantityError("");
                    }}
                    className={`min-w-[50px] h-11 px-3 border rounded-full text-sm flex items-center justify-center transition-all relative overflow-hidden ${selectedSize === size
                      ? isAvailable ? "bg-black text-white border-black" : "border-zinc-600 bg-zinc-600 text-zinc-50"
                      : isAvailable
                        ? "bg-white text-gray-700 border-gray-300 hover:border-black"
                        : "bg-gray-100 text-gray-300 border-gray-200"
                      }`}
                  >
                    {size}
                    {!isAvailable && (
                      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                        <div className={`w-full h-px rotate-45 transform origin-center scale-110 ${selectedSize === size ? "bg-zinc-300" : "bg-gray-300"
                          }`}></div>
                      </div>
                    )}
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
            <div className="flex flex-wrap gap-2">
              {product.variants?.map((variant, index) => {
                const isDual =
                  Array.isArray(variant.colors) && variant.colors.length === 2;

                const bgColor = variant.hex?.startsWith("#")
                  ? variant.hex
                  : variant.hex
                    ? `#${variant.hex}`
                    : "#000000"; // fallback black (not white)

                return (
                  <div key={index} className="relative group/swatch">
                    <button
                      onClick={() => {
                        setSelectedColor(variant.color);
                        setQuantity(1);
                        setQuantityError("");
                        const newSizes = getAvailableSizes(variant);
                        setSelectedSize(newSizes.length > 0 ? newSizes[0] : "");
                      }}
                      className={`relative w-7 h-7 rounded-full border overflow-hidden transition-all duration-400
            ${selectedColor === variant.color
                          ? "ring-1 ring-black ring-offset-1 shadow-md"
                          : "ring-1 ring-transparent hover:ring-black hover:ring-offset-1 hover:shadow-[0_12px_25px_-5px_rgba(0,0,0,0.45)] hover:scale-110"
                        }`}
                    >
                      {isDual ? (
                        <>
                          {/* RIGHT COLOR (Background) */}
                          <span
                            className="absolute inset-0"
                            style={{ backgroundColor: variant.colors[1] }}
                          />
                          {/* LEFT COLOR (Curved Overlay) */}
                          <span
                            className="absolute inset-0"
                            style={{
                              backgroundColor: variant.colors[0],
                              clipPath: "ellipse(95% 70% at 0% 0%)"
                            }}
                          />
                        </>
                      ) : (
                        <span
                          className="absolute inset-0"
                          style={{ backgroundColor: bgColor }}
                        />
                      )}
                    </button>

                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 shadow-xl">
                      {variant.color}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-black"></div>
                    </div>
                  </div>
                );
              })}
            </div>
            {quantityError && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-fade-in flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <p className="text-sm md:text-base font-bold tracking-tight">
                  {quantityError}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 mb-6">
            {(() => {
              const activeVariant = product.variants?.find(v => v.color === selectedColor);
              const stockQty = activeVariant?.stock instanceof Map
                ? Number(activeVariant.stock.get(selectedSize))
                : Number(activeVariant?.stock?.[selectedSize] ?? 0);
              const isSoldOut = selectedSize && stockQty <= 0;

              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button
                        onClick={handleDecreaseQty}
                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30"
                        disabled={isSoldOut}
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className={`w-10 text-center text-sm font-medium ${isSoldOut ? "text-gray-300" : "text-black"}`}>
                        {quantity}
                      </span>
                      <button
                        onClick={handleIncreaseQty}
                        className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-30"
                        disabled={isSoldOut}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={!selectedSize || isSoldOut}
                      className={`flex-1 py-3 px-6 rounded-md font-bold uppercase text-xs tracking-widest transition-all ${isSoldOut
                        ? "bg-[#333333] text-[#cfcfcf]"
                        : "bg-black text-white hover:bg-gray-800 disabled:opacity-50"
                        }`}
                    >
                      {!selectedSize ? "SELECT SIZE" : isSoldOut ? "SOLD OUT" : "ADD TO BAG"}
                    </button>
                  </div>

                  {quantityError && (
                    <p className="text-red-600 text-[12px] font-bold tracking-tight leading-snug mt-1 animate-pulse">
                      {quantityError}
                    </p>
                  )}

                  {isSoldOut && (
                    <button
                      onClick={() => setIsNotifyModalOpen(true)}
                      className="w-full bg-black text-white py-3 rounded-md text-xs font-black tracking-[2px] uppercase hover:bg-zinc-900 transition-all shadow-lg"
                    >
                      NOTIFY ME
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
      {/* Notify Modal */}
      {isNotifyModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
            <div
              className="bg-white w-full max-w-sm rounded-2xl shadow-2xl relative p-8 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsNotifyModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <FiX size={24} />
              </button>
              {notifyStatus.type === "success" ? (
                <div className="text-center animate-fade-in">
                  <div className="mb-6 relative h-40 flex justify-center items-center">
                    <img
                      src="/notify-success.png"
                      alt="Success Illustration"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <h2 className="text-lg font-bold mb-6 text-black">
                    {notifyStatus.message}
                  </h2>
                  <button
                    onClick={() => {
                      setIsNotifyModalOpen(false);
                      setNotifyEmail("");
                      setNotifyStatus({ type: "", message: "" });
                    }}
                    className="w-full bg-[#2d8a63] hover:bg-[#256e4f] text-white font-bold py-3.5 rounded-full transition-all active:scale-[0.98] uppercase text-xs tracking-wider"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-black tracking-tight mb-2 uppercase text-black">
                      Notify When Available
                    </h2>
                    <p className="text-gray-500 text-xs text-black">
                      Sign up with your email and we'll notify you!
                    </p>
                  </div>
                  <form onSubmit={handleNotifySubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                      placeholder="Enter your email here"
                      className="w-full px-5 py-3.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400 text-sm text-black"
                    />
                    {notifyStatus.message && (
                      <p
                        className={`text-center text-xs font-medium ${notifyStatus.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {notifyStatus.message}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isNotifying}
                      className="w-full bg-[#2d8a63] hover:bg-[#256e4f] text-white font-bold py-3.5 rounded-full transition-all active:scale-[0.98] disabled:opacity-50 text-xs tracking-wider"
                    >
                      {isNotifying ? "PLEASE WAIT..." : "NOTIFY ME"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

export default QuickViewModal;