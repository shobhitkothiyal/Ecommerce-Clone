import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiShare2,
  FiStar,
  FiChevronRight,
  FiMinus,
  FiPlus,
  FiArrowLeft,
  FiArrowRight,
  FiX,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { TbRulerMeasure } from "react-icons/tb";
import { RxMagnifyingGlass } from "react-icons/rx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  findProductById,
  findProducts,
} from "../Redux/Customers/Product/action";
import {
  addItemToWishlist,
  removeItemFromWishlist,
} from "../Redux/Auth/actions";
import { addItemToCart } from "../Redux/Customers/Cart/action";
import ProductCard from "./ProductCard";
import { useCart } from "../Context/CartContext";

const AccordionItem = ({ title, isOpen, onToggle, children }) => (
  // ... existing code ...
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full py-4 flex justify-between items-center text-left hover:text-black transition-colors"
    >
      <span className="font-medium text-gray-800">{title}</span>
      <FiChevronRight
        className={`transform transition-transform duration-300 ${isOpen ? "-rotate-90" : "rotate-90"
          }`}
      />
    </button>
    <div
      className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
    >
      <div className="overflow-hidden">
        <div className="text-sm text-gray-600 leading-relaxed space-y-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const swiperRef = useRef(null);
  // product is from Redux
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const recommendedSwiperRef = useRef(null);
  const { setIsCartOpen } = useCart(); // Keep for opening drawer
  const [isCopied, setIsCopied] = useState(false);
  const [isNotifyModalOpen, setIsNotifyModalOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [isNotifying, setIsNotifying] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState({ type: "", message: "" });
  const [quantityError, setQuantityError] = useState("");

  const dispatch = useDispatch();
  const { product, products, loading } = useSelector((store) => store.product);
  const { user } = useSelector((store) => store.auth);
  const { cartItems } = useSelector((store) => store.cart);

  const isWishlisted =
    user &&
    user.wishlist?.some((item) => {
      if (!item) return false;
      const itemId = item._id || item;
      const productId = product?._id;
      return itemId.toString() === productId?.toString();
    });

  useEffect(() => {
    if (productId) {
      dispatch(findProductById({ productId }));
    }
  }, [productId, dispatch]);

  useEffect(() => {
    if (product) {
      // Only set initial variant if navigating to a NEW product or first load
      const isNewProduct = selectedVariant?.productId !== product._id;

      if (isNewProduct) {
        if (product.variants && product.variants.length > 0) {
          const defaultVariant = product.variants[0];
          setSelectedVariant({ ...defaultVariant, productId: product._id });
          setSelectedImage(defaultVariant.images[0]);

          const stockData = defaultVariant.stock;
          const sizes = stockData instanceof Map
            ? Array.from(stockData.keys())
            : Object.keys(stockData || {});

          const firstAvailableSize = sizes.find((size) => {
            const qty = stockData instanceof Map
              ? Number(stockData.get(size))
              : Number(stockData?.[size]);
            return qty > 0;
          });

          if (firstAvailableSize) {
            setSelectedSize(firstAvailableSize);
          } else if (sizes.length > 0) {
            setSelectedSize(sizes[0]);
          }
        }
      }

      // Fetch similar products for recommendations
      dispatch(findProducts({ category: product.category }));
    }
  }, [product, dispatch]); // Keep product as dependency but guard inside

  const handleColorChange = (variant) => {
    setSelectedVariant({ ...variant, productId: product._id });
    setSelectedImage(variant.images[0]);
    setQuantity(1);
    setQuantityError("");
    const stockData = variant.stock;
    const sizes =
      stockData instanceof Map
        ? Array.from(stockData.keys())
        : Object.keys(stockData || {});

    const firstAvailableSize = sizes.find((size) => {
      const qty =
        stockData instanceof Map
          ? Number(stockData.get(size))
          : Number(stockData?.[size]);
      return qty > 0;
    });

    if (firstAvailableSize) {
      setSelectedSize(firstAvailableSize);
    } else if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    }
  };

  const currentAvailableStock = (() => {
    const stockData = selectedVariant?.stock;
    return stockData instanceof Map
      ? Number(stockData.get(selectedSize))
      : Number(stockData?.[selectedSize] ?? 0);
  })();

  const quantityInCart = (cartItems || []).find(
    (item) =>
      item.product?._id === (product?._id || product?.id) &&
      item.size === selectedSize &&
      (item.variant?.color === selectedVariant.color || item.color === selectedVariant.color)
  )?.quantity || 0;

  if (!product || !selectedVariant) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  const toggleAccordion = (section) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const handleDecreaseQuantity = () => {
    setQuantityError("");
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    const remainingStock = currentAvailableStock - quantityInCart;
    if (quantity < remainingStock) {
      setQuantity(quantity + 1);
      setQuantityError("");
    } else {
      if (quantityInCart > 0) {
        setQuantityError("The maximum Quantity of this item is already placed in your cart");
      } else {
        setQuantityError(`Oops! We only have ${currentAvailableStock} units available for this size. 😔`);
      }
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: `Check out this ${product.title} on Uptownie!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
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
          color: selectedVariant.color,
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

  // Calculate price based on variant and discount
  const price = selectedVariant.price;
  const discountPercent = product.discountedPercent || 0;
  const discountedPrice = Math.round(price - (price * discountPercent) / 100);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {/* Breadcrumbs */}
        <nav className="flex items-center justify-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap">
          <span
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <FiChevronRight className="mx-2" />
          <span
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("/pdt/new-in")}
          >
            New IN!
          </span>
          <FiChevronRight className="mx-2" />
          <span className="text-black font-medium truncate">
            {product.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          {/* Left Side - Image Gallery */}
          <div className="flex gap-4 flex-col-reverse sm:flex-row w-full mx-auto lg:mx-0 sticky top-24">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-y-auto scrollbar-hide py-2 sm:py-0 sm:w-20 lg:w-24 shrink-0 h-fit max-h-[70vh]">
              {selectedVariant.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border transition-all duration-300 aspect-3/4 ${selectedImage === img
                    ? "border-black outline-1 outline-black"
                    : "border-gray-200 hover:border-gray-400"
                    }`}
                  onClick={() => {
                    setSelectedImage(img);
                    swiperRef.current?.slideTo(index);
                  }}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Main Image Slider */}
            <div
              className="flex-1 relative bg-gray-50 overflow-hidden rounded-sm group"
              style={{ aspectRatio: "3/4" }}
            >
              <Swiper
                key={selectedVariant.color} // Key to reset swiper on color change
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                loop={selectedVariant.images.length > 1}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onSlideChange={(swiper) =>
                  setSelectedImage(selectedVariant.images[swiper.realIndex])
                }
                className="w-full h-full"
              >
                {selectedVariant.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute top-1/2 left-4 z-10 -translate-y-1/2 bg-white hover:bg-gray-100 text-black p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 disabled:opacity-50"
                aria-label="Previous image"
              >
                <FiArrowLeft size={20} />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 bg-white hover:bg-gray-100 text-black p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 disabled:opacity-50"
                aria-label="Next image"
              >
                <FiArrowRight size={20} />
              </button>

              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-white p-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <RxMagnifyingGlass size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Full Screen Modal */}
          {isModalOpen &&
            createPortal(
              <div className="fixed inset-0 z-9999 bg-black/95 flex justify-center items-center animate-fade-in">
                <button
                  className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-50 p-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  <FiX size={32} />
                </button>

                <button
                  className="absolute left-6 text-white hover:text-gray-300 transition-colors z-50 p-4"
                  onClick={() => swiperRef.current?.slidePrev()}
                >
                  <FiChevronRight size={48} className="rotate-180" />
                </button>

                <div className="h-full w-full p-4 md:p-12 flex justify-center items-center">
                  <img
                    src={selectedImage}
                    alt="Full screen preview"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <button
                  className="absolute right-6 text-white hover:text-gray-300 transition-colors z-50 p-4"
                  onClick={() => swiperRef.current?.slideNext()}
                >
                  <FiChevronRight size={48} />
                </button>
              </div>,
              document.body,
            )}

          {/* Size Chart Modal */}
          {isSizeChartOpen &&
            createPortal(
              <div className="fixed inset-0 z-9999 bg-black/50 flex justify-center items-center animate-fade-in p-4">
                <div className="bg-white relative max-w-4xl w-full max-h-[90vh] overflow-auto rounded-lg shadow-2xl">
                  <button
                    className="absolute top-2 right-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={() => setIsSizeChartOpen(false)}
                  >
                    <FiX size={24} />
                  </button>
                  <img
                    src="https://cdn.shopify.com/s/files/1/1780/3381/files/Uptownie_web_chart_1_d770539e-2782-4a89-bdfd-eafdd981ac5f.jpg?v=1661007987"
                    alt="Size Chart"
                    className="w-full h-auto"
                  />
                </div>
              </div>,
              document.body,
            )}

          {/* Right Side - Product Details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-normal text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="relative flex gap-2">
                {/* Button container with group */}
                <button
                  onClick={() => {
                    if (user) {
                      if (isWishlisted) {
                        dispatch(removeItemFromWishlist(product._id));
                      } else {
                        dispatch(addItemToWishlist(product._id));
                      }
                    } else {
                      navigate("/login");
                    }
                  }}
                  className={`group relative p-2 rounded-full border border-gray-200 transition-colors
          ${isWishlisted ? "bg-black text-white" : "text-gray-600 hover:bg-black hover:text-white"}
        `}
                >
                  <FiStar
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                    className="transition-colors duration-300"
                  />

                  {/* Tooltip sliding from left */}
                  <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-3 py-1 bg-black text-white text-sm rounded-md whitespace-nowrap 
                         opacity-0 translate-x-[-10px] group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 ease-out z-50">
                    {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}

                    {/* Triangle pointer */}
                    <span className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-black rotate-45"></span>
                  </span>
                </button>
              </div>
            </div>

            {/* Average Rating & Share Row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400 text-sm">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FiStar
                      key={star}
                      fill={
                        star <= Math.round(product.rating || 0)
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        star <= Math.round(product.rating || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.numReviews || 0} Reviews)
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-600 hover:text-black transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Share product"
                >
                  <FiShare2 size={20} />
                </button>
                {isCopied && (
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded whitespace-nowrap z-10 animate-fade-in shadow-xl">
                    Copied!
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-black"></div>
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-2">
              <span className="text-red-500 text-2xl tracking-wide">
                ₹ {discountedPrice.toLocaleString()}
              </span>
              <span className="text-gray-400 line-through text-lg">
                ₹ {price.toLocaleString()}
              </span>
              <span className="bg-black text-white text-xs font-bold px-2 py-1 rounded-sm">
                {discountPercent}% SAVE
              </span>
            </div>

            <p className="text-gray-500 text-sm mb-6">Tax included.</p>

            <button
              onClick={() => setIsSizeChartOpen(true)}
              className="flex items-center gap-2 text-black font-medium underline mb-6 hover:text-gray-700 w-fit cursor-pointer transition-colors"
            >
              <TbRulerMeasure size={20} />
              Size Chart
            </button>

            {/* Sizes */}
            <div className="mb-8">
              <p className="font-semibold mb-3 tracking-wide">
                Size: <span className="font-normal">{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {selectedVariant &&
                  (selectedVariant.stock instanceof Map
                    ? Array.from(selectedVariant.stock.keys())
                    : Object.keys(selectedVariant.stock || {})
                  ).map((size) => {
                    const stockQty =
                      selectedVariant.stock instanceof Map
                        ? Number(selectedVariant.stock.get(size))
                        : Number(selectedVariant.stock?.[size]);

                    const isLowStock = stockQty > 0 && stockQty <= 5;

                    return (
                      <div key={size} className="relative group">
                        <button
                          onClick={() => {
                            setSelectedSize(size);
                            setQuantity(1);
                            setQuantityError("");
                          }}
                          className={`min-w-14 h-14 flex items-center justify-center border rounded-full font-medium transition-all duration-200 relative overflow-hidden ${stockQty <= 0
                            ? selectedSize === size
                              ? "border-zinc-600 bg-zinc-600 text-zinc-100"
                              : "border-gray-100 bg-gray-50 text-gray-300"
                            : selectedSize === size
                              ? "border-black bg-black text-white"
                              : "border-gray-200 hover:border-black text-gray-900"
                            } ${isLowStock ? "mb-2" : ""}`} // Add margin if low stock badge to prevent overlapping next row if wrapped tightly, though absolute positioning handles it mostly.
                        >
                          {size}
                          {stockQty <= 0 && (
                            <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                              <div className={`w-full h-px rotate-45 transform origin-center scale-110 ${selectedSize === size ? "bg-zinc-300" : "bg-gray-300"
                                }`}></div>
                            </div>
                          )}
                        </button>
                        {isLowStock && (
                          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap z-10 shadow-sm leading-none border border-white">
                            {stockQty} Left
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="font-semibold mb-3 tracking-wide">
                Color: <span className="font-normal">{selectedVariant.color}</span>
              </p>

              <div className="flex gap-4 items-center">
                {product.variants.map((variant, index) => {
                  const isDual =
                    Array.isArray(variant.colors) && variant.colors.length === 2;
                  const isVariantOOS = variant.manuallyOutOfStock || !variant.stock || Object.values(variant.stock).every((qty) => qty <= 0);

                  return (
                    <div key={index} className="relative group">
                      <button
                        onClick={() => handleColorChange(variant)}
                        className={`w-9 h-9 rounded-full border relative overflow-hidden transition-all duration-400
              ${selectedVariant === variant
                            ? "ring-1 ring-black ring-offset-1 shadow-md"
                            : "hover:ring-1 hover:ring-black hover:ring-offset-1 hover:shadow-[0_15px_35px_-5px_rgba(0,0,0,0.45)] hover:scale-110"
                          } ${isVariantOOS ? "opacity-90" : ""}`}
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
                                clipPath: "ellipse(95% 70% at 0% 0%)",
                              }}
                            />
                          </>
                        ) : (
                          <span
                            className="absolute inset-0"
                            style={{ backgroundColor: variant.hex || variant.colors?.[0] || "#ffffff" }}
                          />
                        )}

                        {/* OUT OF STOCK LINE OVERLAY */}
                        {isVariantOOS && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                            <div className="w-[140%] h-[1.5px] bg-white shadow-[0_0_2px_rgba(0,0,0,0.5)] transform -rotate-45"></div>
                          </div>
                        )}
                      </button>

                      {/* Tooltip - Enhanced */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-md
            opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                        {variant.color} {isVariantOOS && "(Out of Stock)"}
                        {/* Arrow pointer */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black"></div>
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


            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <p className="font-semibold mb-3 tracking-wide">Quantity</p>

              {(() => {
                const stockData = selectedVariant?.stock;
                const stockQty = stockData instanceof Map
                  ? Number(stockData.get(selectedSize))
                  : Number(stockData?.[selectedSize] ?? 0);
                const isSoldOut = selectedSize && (stockQty <= 0 || selectedVariant?.manuallyOutOfStock);

                return (
                  <div className="space-y-4">
                    <div className="flex items-stretch gap-4">
                      {/* Quantity Control */}
                      <div className="flex items-stretch rounded border border-gray-300 h-[54px] bg-white shrink-0">
                        <button
                          onClick={handleDecreaseQuantity}
                          className="px-5 hover:bg-zinc-50 transition-colors flex items-center justify-center"
                          disabled={isSoldOut}
                        >
                          <FiMinus size={16} className={isSoldOut ? "text-gray-300" : "text-black"} />
                        </button>
                        <div className={`px-4 min-w-[50px] flex items-center justify-center font-bold text-base ${isSoldOut ? "text-gray-300" : "text-black"}`}>
                          {quantity}
                        </div>
                        <button
                          onClick={handleIncreaseQuantity}
                          className="px-5 hover:bg-zinc-50 transition-colors flex items-center justify-center"
                          disabled={isSoldOut}
                        >
                          <FiPlus size={16} className={isSoldOut ? "text-gray-300" : "text-black"} />
                        </button>
                      </div>

                      {/* Main Action Button */}
                      <div className="flex-1">
                        <button
                          onClick={() => {
                            if (isSoldOut) return;
                            if (user) {
                              const data = {
                                productId: product?._id,
                                size: selectedSize,
                                quantity: Math.min(quantity, currentAvailableStock - quantityInCart),
                                variant: selectedVariant,
                              };
                              dispatch(addItemToCart(data));
                              setQuantity(1);
                              setIsCartOpen(true);
                            } else {
                              navigate("/login");
                            }
                          }}

                          disabled={isSoldOut}
                          className={`w-full h-full px-8 py-4 text-sm font-bold tracking-widest transition-all duration-300 uppercase ${isSoldOut
                            ? "bg-[#333333] text-[#cfcfcf]" // Dark gray as per image
                            : "bg-black text-white hover:bg-gray-800 active:scale-[0.98]"
                            }`}
                        >
                          {isSoldOut ? "SOLD OUT" : "ADD TO BAG"}
                        </button>
                      </div>
                    </div>

                    {/* Notify Me Button - Only appears when sold out */}
                    {isSoldOut && (
                      <button
                        onClick={() => setIsNotifyModalOpen(true)}
                        className="w-full bg-black text-white py-4 text-sm font-black tracking-[3px] uppercase hover:bg-zinc-900 transition-all active:scale-[0.99] shadow-lg"
                      >
                        NOTIFY ME
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Notify Me Modal */}
            {isNotifyModalOpen &&
              createPortal(
                <div className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative p-8 animate-fade-in">
                    {/* Close Button */}
                    <button
                      onClick={() => setIsNotifyModalOpen(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                    >
                      <FiX size={24} />
                    </button>

                    {/* Content */}
                    {notifyStatus.type === "success" ? (
                      <div className="text-center animate-fade-in">
                        <div className="mb-6 relative h-48 flex justify-center items-center">
                          <img
                            src="/notify-success.png"
                            alt="Success Illustration"
                            className="max-h-full object-contain"
                          />
                        </div>
                        <h2 className="text-xl font-bold mb-8 text-black">
                          {notifyStatus.message}
                        </h2>
                        <button
                          onClick={() => {
                            setIsNotifyModalOpen(false);
                            setNotifyEmail("");
                            setNotifyStatus({ type: "", message: "" });
                          }}
                          className="w-full bg-[#2d8a63] hover:bg-[#256e4f] text-white font-bold py-4 rounded-3xl transition-all active:scale-[0.98] uppercase tracking-wider"
                        >
                          Confirm
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-8">
                          <h2 className="text-2xl font-black tracking-tight mb-2 uppercase">Notify When Available</h2>
                          <p className="text-gray-500 text-sm">Sign up with your email and we'll notify you!</p>
                        </div>

                        <form onSubmit={handleNotifySubmit} className="space-y-6">
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={notifyEmail}
                              onChange={(e) => setNotifyEmail(e.target.value)}
                              placeholder="Enter your email here"
                              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all placeholder:text-gray-400"
                            />
                          </div>

                          {notifyStatus.message && (
                            <p className={`text-center text-sm font-medium ${notifyStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
                              {notifyStatus.message}
                            </p>
                          )}

                          <button
                            type="submit"
                            disabled={isNotifying}
                            className="w-full bg-[#2d8a63] hover:bg-[#256e4f] text-white font-bold py-4 rounded-full transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            style={{ backgroundColor: "#2d8a63" }} // Exact green from image
                          >
                            {isNotifying ? (
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              "NOTIFY ME"
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </div>,
                document.body,
              )}

            {/* Accordions */}
            <div className="border-t border-gray-200">
              <AccordionItem
                title="Product Description"
                isOpen={activeAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <p className="mb-4">{product.description}</p>
                {/* Other Information */}
                {Array.isArray(product.details) && product.details.length > 0 && (
                  <div className="mt-4">
                    <p className="font-bold  underline mb-3">
                      Other Information:
                    </p>

                    <ul className="list-none m-0 p-0">
                      {product.details.map((detail, index) => {
                        // Case 1: Heading only
                        if (detail.key && !detail.value) {
                          return (
                            <li
                              key={index}
                              className="relative pl-6 mb-4 text-[14.5px] font-semibold text-gray-800"
                            >
                              <span className="absolute left-0 top-[9px] w-[6px] h-[6px] rounded-full bg-gray-400"></span>
                              {detail.key}
                            </li>
                          );
                        }

                        // Case 2: Heading + Value
                        if (detail.key && detail.value) {
                          return (
                            <li
                              key={index}
                              className="relative pl-6 mb-4 text-[14.5px] leading-[1.6] text-gray-600"
                            >
                              <span className="absolute left-0 top-[9px] w-[6px] h-[6px] rounded-full bg-gray-400"></span>

                              <span className="font-semibold text-gray-700">
                                {detail.key}-
                              </span>{" "}
                              {detail.value}
                            </li>
                          );
                        }

                        return null;
                      })}
                    </ul>

                  </div>
                )}

              </AccordionItem>
              <AccordionItem
                title="Wash Care"
                isOpen={activeAccordion === "washCare"}
                onToggle={() => toggleAccordion("washCare")}
              >
                <ul className="list-disc pl-5 space-y-1">
                  <li>Machine wash cold with like colors</li>
                  <li>Do not bleach</li>
                  <li>Tumble dry low</li>
                  <li>Iron on low heat if needed</li>
                </ul>
              </AccordionItem>

              <AccordionItem
                title="Shipping & Returns"
                isOpen={activeAccordion === "shipping"}
                onToggle={() => toggleAccordion("shipping")}
              >
                <p>
                  Free shipping on orders over ₹999. Easy returns within 7 days
                  of delivery.
                </p>
              </AccordionItem>

              <AccordionItem
                title="Manufacturing Information"
                isOpen={activeAccordion === "manufacturing"}
                onToggle={() => toggleAccordion("manufacturing")}
              >
                <p>Manufactured by: Uptownie Fashions Pvt Ltd</p>
                <p>Country of Origin: India</p>
              </AccordionItem>
            </div>

            <div className="mt-12 mb-8">
              <h2 className="text-xl font-bold mb-6">Customer Reviews</h2>

              <div className="flex items-center gap-4 mb-8 bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-bold">
                    {product.rating ? product.rating.toFixed(1) : "0.0"}
                  </span>
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        fill={
                          star <= Math.round(product.rating || 0)
                            ? "currentColor"
                            : "none"
                        }
                        className={
                          star <= Math.round(product.rating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {product.numReviews || 0} Reviews
                  </span>
                </div>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 last:border-0 pb-6"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">
                          {review.name || "Verified User"}
                        </div>
                        <span className="text-gray-400 text-xs">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex text-yellow-400 text-xs mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            fill={
                              star <= review.rating ? "currentColor" : "none"
                            }
                            className={
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      {review.headline && (
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                          {review.headline}
                        </h4>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">
                        {review.comment}
                      </p>

                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2 mb-2">
                          {review.images.map((img, i) => (
                            <div
                              key={i}
                              className="w-20 h-20 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90"
                              onClick={() => {
                                setSelectedImage(img);
                                setIsModalOpen(true);
                              }}
                            >
                              <img
                                src={img}
                                alt={`Review attachment ${i + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                  <p className="mb-2">No reviews yet.</p>
                  <p className="text-sm">
                    Buy this product and be the first to review!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div >
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="relative group/rec">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            navigation={{
              prevEl: ".prev-rec",
              nextEl: ".next-rec",
            }}
            onBeforeInit={(swiper) => {
              recommendedSwiperRef.current = swiper;
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 4,
              },
              1280: {
                slidesPerView: 5,
              },
            }}
            className="w-full py-4 px-2 "
          >
            {products?.content
              ?.filter((p) => p.id !== product?.id)
              .map((item) => (
                <SwiperSlide key={item._id || item.id}>
                  <ProductCard product={item} />
                </SwiperSlide>
              ))}
          </Swiper>

          {/* Custom Navigation Buttons for Recommended Section */}
          <button
            className="prev-rec absolute top-1/2 -left-4 z-10 -translate-y-1/2 bg-white hover:bg-gray-50 text-black border border-gray-200 p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Previous products"
          >
            <FiChevronRight size={20} className="rotate-180" />
          </button>

          <button
            className="next-rec absolute top-1/2 -right-4 z-10 -translate-y-1/2 bg-white hover:bg-gray-50 text-black border border-gray-200 p-3 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label="Next products"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;