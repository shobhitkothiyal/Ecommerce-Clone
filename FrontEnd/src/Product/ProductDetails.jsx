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
import ProductData from "./ProductData";
import ProductCard from "./ProductCard";
import { useCart } from "../Context/CartContext";

const AccordionItem = ({ title, isOpen, onToggle, children }) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="w-full py-4 flex justify-between items-center text-left hover:text-black transition-colors"
    >
      <span className="font-medium text-gray-800">{title}</span>
      <FiChevronRight
        className={`transform transition-transform duration-300 ${
          isOpen ? "-rotate-90" : "rotate-90"
        }`}
      />
    </button>
    <div
      className={`grid transition-all duration-300 ease-in-out ${
        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
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
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const recommendedSwiperRef = useRef(null);
  const { addToCart, addToWishlist, wishlistItems, removeFromWishlist } =
    useCart();

  const isWishlisted = wishlistItems.some((item) => item.id === product?.id);

  useEffect(() => {
    // Find product by ID
    const foundProduct = ProductData.find((p) => p.id === parseInt(productId));
    if (foundProduct) {
      setProduct(foundProduct);
      if (foundProduct.variants && foundProduct.variants.length > 0) {
        const defaultVariant = foundProduct.variants[0];
        setSelectedVariant(defaultVariant);
        setSelectedImage(defaultVariant.images[0]);
        // Set default size if available in stock
        const sizes = Object.keys(defaultVariant.stock);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
      }
    }
  }, [productId]);

  const handleColorChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.images[0]);
    // Reset size when color changes, or try to keep same size?
    // Let's reset to first available size
    const sizes = Object.keys(variant.stock);
    if (sizes.length > 0) setSelectedSize(sizes[0]);
  };

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
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Calculate price based on variant and discount
  const price = selectedVariant.basePrice;
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
            <div className="flex sm:flex-col gap-4 overflow-x-auto sm:overflow-visible scrollbar-hide py-2 sm:py-0 sm:w-20 lg:w-24 shrink-0 h-fit max-h-[70vh]">
              {selectedVariant.images.map((img, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border transition-all duration-300 aspect-3/4 ${
                    selectedImage === img
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
                loop={true}
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
              document.body
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
              document.body
            )}

          {/* Right Side - Product Details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-normal text-gray-900 mb-2">
                {product.title}
              </h1>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (isWishlisted) {
                      removeFromWishlist(product.id);
                    } else {
                      addToWishlist(product);
                    }
                  }}
                  className={`p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors ${
                    isWishlisted ? "text-black fill-black" : "text-gray-600"
                  }`}
                >
                  <FiStar
                    size={20}
                    fill={isWishlisted ? "currentColor" : "none"}
                  />
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button className="p-2 text-gray-600 hover:text-black transition-colors">
                <FiShare2 size={24} />
              </button>
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
                {Object.keys(selectedVariant.stock).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-13.5 h-13.5 rounded-full flex items-center justify-center border font-ligh transition-all duration-200 ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-black text-gray-900"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <p className="font-semibold mb-3 tracking-wide">
                Color:{" "}
                <span className="font-normal">{selectedVariant.color}</span>
              </p>

              <div className="flex gap-4">
                {product.variants.map((variant) => (
                  <div key={variant.color} className="relative group">
                    <button
                      onClick={() => handleColorChange(variant)}
                      className={`w-10 h-10 rounded-full border-2 p-1 transition-all duration-300 ${
                        selectedVariant.color === variant.color
                          ? "border-black scale-110"
                          : "border-transparent hover:border-gray-300 hover:scale-105"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-full shadow-sm"
                        style={{ backgroundColor: variant.hex }}
                      />
                    </button>

                    {/* Tooltip */}
                    <div
                      className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2
            px-3 py-1 bg-black text-white text-xs rounded
            opacity-0 group-hover:opacity-100
            transition-all duration-300
            whitespace-nowrap z-40
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

            {/* Quantity & Add to Cart */}
            <div className="mb-8">
              <p className="font-semibold mb-3 tracking-wide">Quantity</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={handleDecreaseQuantity}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <FiMinus size={16} />
                  </button>
                  <span className="px-4 py-3 min-w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncreaseQuantity}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <FiPlus size={16} />
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center flex-1">
                  <button
                    onClick={() =>
                      addToCart(
                        product,
                        selectedVariant,
                        selectedSize,
                        quantity
                      )
                    }
                    className="w-full px-8 py-4 bg-black text-white text-sm font-bold tracking-wide hover:bg-gray-800 transition-colors uppercase"
                  >
                    ADD TO BAG
                  </button>

                  <button className="p-3 text-green-500 hover:text-green-600 transition-colors hover:bg-green-50 rounded-full border border-green-100">
                    <FaWhatsapp size={28} />
                  </button>
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-gray-200">
              <AccordionItem
                title="Product Description"
                isOpen={activeAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <p className="mb-4">{product.description}</p>
                <div className="mt-4">
                  <p className="font-bold underline mb-2">Other Information:</p>
                  <ul className="list-disc pl-5 space-y-2 marker:text-gray-400">
                    <li>
                      <span className="font-semibold text-gray-700">Type-</span>{" "}
                      Shirt
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">
                        Fabric-
                      </span>{" "}
                      {product.details.fabric}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">Fit-</span>{" "}
                      {product.details.fit}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">Neck-</span>{" "}
                      {product.details.neck}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">
                        Sleeve-
                      </span>{" "}
                      {product.details.sleeve}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">
                        Length-
                      </span>{" "}
                      {product.details.length}
                    </li>
                    <li>
                      <span className="font-semibold text-gray-700">
                        Occasion-
                      </span>{" "}
                      Party/Night out/Dinner
                    </li>
                  </ul>
                </div>
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
              <h2 className="text-xl text-center mb-2">Customer Reviews</h2>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <FiStar key={i} className="text-black" />
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mb-4">
                Be the first to write a review
              </p>
              <div className="flex justify-center">
                <button className="bg-zinc-800 text-white px-8 py-2 hover:bg-black transition-colors">
                  Write a review
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
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
            className="w-full py-4 px-2"
          >
            {ProductData.filter((p) => p.id !== product.id).map((item) => (
              <SwiperSlide key={item.id}>
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
