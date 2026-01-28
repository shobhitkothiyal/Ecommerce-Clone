import React, { useState, useEffect } from "react";
import {
  MdClose,
  MdDeleteOutline,
  MdKeyboardArrowDown,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdAdd,
  MdEdit,
} from "react-icons/md";
import { FaTag, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCart,
  removeCartItem,
  updateCartItem,
  clearCartAction,
  applyCoupon as applyCouponAction,
  removeCoupon as removeCouponAction,
  addItemToCart,
} from "../Redux/Customers/Cart/Action";
import { getUserAddresses, addAddress } from "../Redux/Auth/actions";
import { findProducts } from "../Redux/Customers/Product/action";
import { useCart } from "../Context/CartContext";
import confetti from "canvas-confetti";
import axios from "axios";
// import { API_BASE_URL } from "../config/apiConfig";
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api";

import ViewAllOffers from "./ViewAllOffers";

function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((store) => store.cart);
  const { cart, error } = useSelector((store) => store.cart);

  // Calculate Subtotal dynamically to ensure it matches the displayed discounted prices
  const subtotal = (cartItems || []).reduce((acc, item) => {
    if (!item.product) return acc;
    const variant = item.variant || item.product.variants?.[0];
    const price = variant?.price || 0;
    const discountPercent = item.product.discountedPercent || 0;
    const discountedPrice = Math.round(price - (price * discountPercent) / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);
  const { user } = useSelector((store) => store.auth);
  const { products } = useSelector((store) => store.product);

  // Local state for UI
  const { setIsCartOpen, isCartOpen } = useCart(); // Still use context for UI state 'isCartOpen' only? Or move to Redux UI state?
  // Previous file used useCart for isCartOpen. Let's assume we keep useCart ONLY for UI state or move it.
  // Ideally move 'isCartOpen' to Redux or keep local if it's just a drawer trigger.
  // The Context provided: cartItems, isCartOpen, setIsCartOpen, etc.
  // I will only use 'isCartOpen', 'setIsCartOpen' from context for now to minimize refactor impact on other components that might toggle it.

  // Note: 'cartItems' from Redux might be populated objects differently than local storage.
  // Backend returns: cartItems usually with 'product' populated.
  // My backend 'cartItem' model has 'product' ref. And Service populates it.
  // So 'item.product' will be the product object. 'item.size' is size.
  // Previous local code accessed 'item.variant.basePrice'.
  // My backend model has 'price' and 'discountedPrice' on cartItem itself.
  // Also 'item.product' has 'variants'.
  // I need to adapt the rendering logic below to match backend data structure.

  // Backend CartItem Structure:
  // { _id, product: {...}, size, quantity, price, discountedPrice, userId }

  const [step, setStep] = useState(1); // 1: Cart, 2: Address
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",

    mobile: "",
  });

  const [isChangingAddress, setIsChangingAddress] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [isOffersOpen, setIsOffersOpen] = useState(false);

  const handleApplyCoupon = () => {
    dispatch(applyCouponAction(couponCode));
  };

  // Load Cart and Addresses
  useEffect(() => {
    if (isCartOpen) {
      dispatch(getCart());
      dispatch(getUserAddresses());
    }
  }, [dispatch, isCartOpen]);

  // Set default selected address
  // Set default selected address on open or load
  useEffect(() => {
    if (isCartOpen && user?.addresses?.length > 0) {
      // Check if addresses are populated (have firstName or streetAddress) logic
      // If we just check user.addresses, it should trigger on Redux update
      const validAddresses = user.addresses.filter(
        (a) => typeof a === "object" && (a.firstName || a.name),
      );

      if (validAddresses.length > 0) {
        const defaultAddr =
          validAddresses.find((a) => a.isDefault) || validAddresses[0];

        // Only update if current selectedAddress is null or lacks data (is an ID)
        if (!selectedAddress || !selectedAddress.firstName) {
          setSelectedAddress(defaultAddr);
        }
      }
    }
  }, [isCartOpen, user?.addresses]); // Depend on user.addresses array reference

  const handleRemoveItem = (cartItemId) => {
    dispatch(removeCartItem(cartItemId));
  };

  const handleUpdateQty = (cartItemId, quantity) => {
    dispatch(updateCartItem({ cartItemId, data: { quantity } }));
  };

  const handleAddressFormChange = (e) => {
    setAddressFormData({ ...addressFormData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = () => {
    dispatch(addAddress(addressFormData));
    setIsAddressFormOpen(false);
    setAddressFormData({
      firstName: "",
      lastName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      mobile: "",
    });
  };

  const handlePayment = async () => {
    try {
      if (!cartItems || cartItems.length === 0) return;
      if (!selectedAddress) {
        alert("Please select a delivery address.");
        return;
      }

      const token = localStorage.getItem("jwt");

      // Totals calculation
      const subtotal = cart?.totalPrice || 0;
      let activeDiscountPercent = 0;
      const discountThreshold1 = 3999;
      const discountThreshold2 = 8999;

      if (subtotal >= discountThreshold2) activeDiscountPercent = 15;
      else if (subtotal >= discountThreshold1) activeDiscountPercent = 12;

      const discountAmount = (subtotal * activeDiscountPercent) / 100;
      const finalTotal = subtotal - discountAmount;
      const shippingCharges = finalTotal > 3999 ? 0 : 50;
      const totalPayable = finalTotal + shippingCharges;

      // 1. Create Order Link
      const orderResponse = await axios.post(
        `${API_BASE_URL}/payments/create-order`,
        { amount: totalPayable, currency: "INR" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const {
        id: razorpayOrderId,
        amount: razorpayAmount,
        currency,
      } = orderResponse.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_R7AbhwIhpDdPws", // Fallback to test key if env missing in frontend
        amount: razorpayAmount,
        currency: currency,
        name: "Uptownie",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyResponse = await axios.post(
              `${API_BASE_URL}/payments/verify-payment`,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                shippingAddress: selectedAddress, // Use selected address
              },
              { headers: { Authorization: `Bearer ${token}` } },
            );

            if (verifyResponse.data.success) {
              const orderId = verifyResponse.data.order._id;
              setIsCartOpen(false);
              setStep(1); // Reset step
              navigate(`/order-success/${orderId}`);
            }
          } catch (error) {
            console.error("Payment verification failed", error);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: `${selectedAddress.firstName} ${selectedAddress.lastName}`,
          email: user?.email || "",
          contact: selectedAddress.mobile,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Could not initiate payment. Please try again.");
    }
  };

  // Calculate totals from Redux text (or rely on backend totals in 'cart')
  // Backend 'cart' object has totalPrice, totalDiscountedPrice, etc.

  // --- UI Helpers ---

  const discountThreshold1 = 3999;
  const discountThreshold2 = 8999;

  let progressPercent = 0;
  let activeDiscountPercent = 0;
  let activeCouponCode = "";

  if (subtotal < discountThreshold1) {
    progressPercent = (subtotal / discountThreshold1) * 50;
    activeDiscountPercent = 0;
  } else if (subtotal < discountThreshold2) {
    progressPercent =
      50 +
      ((subtotal - discountThreshold1) /
        (discountThreshold2 - discountThreshold1)) *
        50;
    activeDiscountPercent = 12;
    activeCouponCode = "HOLIDAY12";
  } else {
    progressPercent = 100;
    activeDiscountPercent = 15;
    activeCouponCode = "HOLIDAY15";
  }

  // Backend 'totalPrice' is sum of item prices.
  // Calculated:
  // User Requirement: Apply discount on the THRESHOLD amount, not the total amount.
  // i.e., 12% of 3999 (fixed) or 15% of 8999 (fixed).
  let discountAmount = 0;

  if (cart?.couponCode) {
    // If a backend coupon is applied, use the backend's calculated discount
    discountAmount =
      cart.couponDiscount || cart.totalPrice - cart.totalDiscountedPrice || 0;
  } else if (activeDiscountPercent === 12) {
    discountAmount = (discountThreshold1 * 12) / 100;
  } else if (activeDiscountPercent === 15) {
    discountAmount = (discountThreshold2 * 15) / 100;
  }

  const finalTotal = subtotal - discountAmount;
  const shippingCharges = finalTotal > 3999 ? 0 : 50;
  const totalPayable = finalTotal + shippingCharges;

  const remainingFor12 = Math.max(0, discountThreshold1 - subtotal);
  const remainingFor15 = Math.max(0, discountThreshold2 - subtotal);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [prevDiscount, setPrevDiscount] = useState(0);

  const { products: recommendedProductsData } = useSelector(
    (store) => store.product,
  );

  useEffect(() => {
    if (
      !recommendedProductsData?.content ||
      recommendedProductsData.content.length === 0
    ) {
      dispatch(findProducts({}));
    }
  }, [dispatch, recommendedProductsData]);

  const recommendedProducts =
    recommendedProductsData?.content?.slice(0, 5) || [];
  const confettiRef = React.useRef(null);

  useEffect(() => {
    if (activeDiscountPercent > prevDiscount && confettiRef.current) {
      // ... confetti ...
      const myConfetti = confetti.create(confettiRef.current, {
        resize: true,
        useWorker: true,
      });
      myConfetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#000000", "#FFD700", "#C0C0C0"],
        scalar: 0.8,
        disableForReducedMotion: true,
      });
    }
    setPrevDiscount(activeDiscountPercent);
  }, [activeDiscountPercent]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 overflow-hidden">
      {/* Drawer Content */}
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden relative">
        <canvas
          ref={confettiRef}
          className="absolute inset-0 pointer-events-none z-50 w-full h-full"
        />
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="hover:bg-gray-100 p-1 rounded-full"
              >
                <MdKeyboardArrowLeft size={24} />
              </button>
            )}
            <h2 className="text-xl font-bold">
              {step === 1
                ? `Your Cart (${cartItems?.length || 0})`
                : "Select Address"}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-black transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 pb-[200px]">
          {step === 1 ? (
            /* Step 1: Cart View */
            <>
              {/* Progress Bar */}
              <div className="bg-white p-4 mb-2">
                <p className="text-sm font-semibold text-center mb-10">
                  {remainingFor12 > 0
                    ? `Add products worth ₹${remainingFor12.toLocaleString()} to unlock 12% off!`
                    : remainingFor15 > 0
                      ? `Add products worth ₹${remainingFor15.toLocaleString()} to unlock 15% off!`
                      : "You've unlocked maximum discount!"}
                </p>
                <div className="relative w-full h-2 bg-gray-200 rounded-full mb-6">
                  <div
                    className="absolute top-0 left-0 h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                  {/* Milestones */}
                  <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold z-10 transition-colors duration-300 ${
                        progressPercent >= 50
                          ? "bg-black text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      %
                    </div>
                    <span className="text-[10px] text-center mt-3 text-gray-500 leading-tight">
                      12% off
                      <br />
                      unlocked
                    </span>
                    <span className="absolute -top-4 text-xs font-medium text-gray-400">
                      ₹3,999
                    </span>
                  </div>
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-0 flex flex-col items-center">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold z-10 transition-colors duration-300 ${
                        progressPercent >= 100
                          ? "bg-black text-white"
                          : "bg-gray-300 text-gray-500"
                      }`}
                    >
                      %
                    </div>
                    <span className="text-[10px] text-center mt-3 text-gray-500 leading-tight">
                      15% off
                      <br />
                      unlocked
                    </span>
                    <span className="absolute -top-4 right-0 text-xs font-medium text-gray-400">
                      ₹8,999
                    </span>
                  </div>
                </div>
              </div>

              {!cartItems || cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-gray-500 mb-4">Your cart is empty.</p>
                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/");
                    }}
                    className="bg-black text-white px-6 py-2 rounded font-bold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-white p-4 space-y-4 mb-2">
                    {cartItems.map((item) => {
                      if (!item?.product) return null;
                      const fullProduct = item.product;
                      const activeVariant =
                        item.variant || fullProduct.variants?.[0];

                      // Fallback if no variant found
                      if (!activeVariant) return null;

                      return (
                        <div
                          key={item._id}
                          className="bg-white border boundary-gray-200 rounded-2xl p-3 flex gap-3 relative shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                        >
                          {/* Image */}
                          <div className="w-20 h-28 shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                            <img
                              src={activeVariant.images?.[0] || ""}
                              alt={fullProduct.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Details Column */}
                          <div className="flex-1 flex flex-col relative min-w-0">
                            {/* Title & Price Row */}
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h3 className="font-medium text-sm leading-snug text-gray-900 line-clamp-2 pt-0.5">
                                {fullProduct.title}
                              </h3>
                              <div className="text-right shrink-0">
                                <p className="font-bold text-sm text-gray-900">
                                  ₹
                                  {Math.round(
                                    activeVariant.price -
                                      (activeVariant.price *
                                        (fullProduct.discountedPercent || 0)) /
                                        100,
                                  ).toLocaleString()}
                                </p>
                                {(fullProduct.discountedPercent || 0) > 0 && (
                                  <p className="text-xs text-gray-400 line-through">
                                    ₹{activeVariant.price.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Selectors - Stacked Left */}
                            <div className="flex flex-col gap-2 mt-1 items-start">
                              {/* Size Selector */}
                              <div className="relative">
                                <span className="text-xs border border-gray-300 rounded px-2 py-1">
                                  Size: {item.size}
                                </span>
                                {/* Update Size not implemented in backend yet fully, so just display */}
                              </div>

                              {/* Color Selector */}
                              <div className="relative">
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      activeVariant.hex || activeVariant.color,
                                  }}
                                ></div>
                              </div>
                            </div>

                            {/* Actions - Bottom Right Absolute or Flex */}
                            <div className="mt-auto flex justify-end items-center gap-3 pt-2">
                              {/* Quantity Control Pill */}
                              <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                <button
                                  onClick={() =>
                                    handleUpdateQty(item._id, item.quantity - 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-30"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="text-xs font-bold w-6 text-center text-gray-900">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleUpdateQty(item._id, item.quantity + 1)
                                  }
                                  className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-black hover:bg-gray-100 rounded-r-lg transition-colors"
                                >
                                  +
                                </button>
                              </div>

                              {/* Delete Button */}
                              <button
                                onClick={() => handleRemoveItem(item._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                              >
                                <MdDeleteOutline size={20} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {/* Empty Cart Button - Placed below products */}
                    <div className="flex justify-center pt-2 border-t border-gray-100 mt-2">
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to empty your cart?",
                            )
                          ) {
                            dispatch(clearCartAction());
                          }
                        }}
                        className="text-xs text-red-500 cursor-pointer font-bold hover:text-red-700 flex items-center gap-1"
                      >
                        <MdDeleteOutline /> Empty Cart
                      </button>
                    </div>
                  </div>

                  {/* Success Coupon Alert */}
                  {activeDiscountPercent > 0 &&
                    cartItems.length > 0 &&
                    !cart?.couponCode && (
                      <div className="bg-white px-4 mb-2">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FaTag className="text-green-600" size={14} />
                            <span className="font-bold text-sm text-gray-800">
                              {activeCouponCode} applied
                            </span>
                          </div>
                          <span className="text-sm font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                            Saved ₹
                            {discountAmount.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                  {/* Coupon Input */}
                  <div className="bg-white p-4 mb-2">
                    {cart?.couponCode ? (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FaTag className="text-green-600" size={14} />
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-800">
                              {cart.couponCode} applied
                            </span>
                            <span className="text-xs text-green-700 font-medium">
                              Saved ₹
                              {discountAmount.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch(removeCouponAction())}
                          className="text-xs cursor-pointer hover:opacity-75 text-red-500 underline font-bold"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="border border-green-200 rounded-lg p-3 bg-green-50/10 flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                          <span className="font-bold cursor-pointer hover:opacity-75 bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
                            %
                          </span>
                          <input
                            type="text"
                            placeholder="Enter Coupon Code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="bg-transparent w-full focus:outline-none placeholder:text-gray-400 text-black text-sm"
                          />
                          <button
                            onClick={handleApplyCoupon}
                            disabled={!couponCode}
                            className="text-xs cursor-pointer hover:opacity-105 hover:text-green-600 font-bold text-black uppercase disabled:opacity-50"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}

                    {(cart?.couponError || error) && (
                      <p className="text-red-500 text-xs mt-1">
                        {cart?.couponError || error}
                      </p>
                    )}
                    {/* Note: couponError isn't in Redux state "cart" object unless we put it there in reducer or response. 
                        In my service update, I put couponError in the cart response object. So it should exist if sent back.
                     */}

                    <p
                      onClick={() => setIsOffersOpen(true)}
                      className="text-center text-blue-600 text-xs font-bold mt-2 cursor-pointer hover:underline flex items-center justify-center gap-1"
                    >
                      View All Offers <MdKeyboardArrowRight />
                    </p>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      Only one coupon can be applied at a time.
                    </p>
                  </div>

                  {/* FBT */}
                  <div className="bg-white p-4 mb-4">
                    <h3 className="font-bold text-sm mb-3">
                      Frequently Bought Together
                    </h3>
                    <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2">
                      {recommendedProducts.map((rec) => (
                        <div
                          key={rec.id}
                          className="min-w-[140px] border border-gray-100 rounded-lg p-2 flex flex-col gap-2 relative bg-white cursor-pointer hover:shadow-md transition-all"
                          onClick={() => navigate(`/product/${rec._id}`)}
                        >
                          <img
                            src={
                              rec.variants && rec.variants.length > 0
                                ? rec.variants[0].images[0]
                                : ""
                            }
                            className="w-full h-32 object-cover rounded-md"
                            alt={rec.title}
                          />
                          <div>
                            <p className="text-xs font-medium truncate">
                              {rec.title}
                            </p>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="text-xs font-bold">
                                ₹
                                {rec.variants?.[0]?.price?.toLocaleString() ||
                                  "N/A"}
                              </span>
                              <span className="text-[10px] text-gray-400 line-through">
                                ₹
                                {(
                                  (rec.variants?.[0]?.price || 0) * 1.5
                                ).toFixed(0)}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                const v = rec.variants?.[0];
                                if (v) {
                                  const s =
                                    v.stock && typeof v.stock === "object"
                                      ? Object.keys(v.stock)[0]
                                      : "OneSize";
                                  dispatch(
                                    addItemToCart({
                                      productId: rec._id,
                                      size: s,
                                      quantity: 1,
                                    }),
                                  );
                                }
                              }}
                              className="w-full mt-2 border border-black text-black text-xs font-bold py-1 rounded hover:bg-black hover:text-white transition-colors"
                            >
                              + Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            /* Step 2: Address Selection */
            <div className="p-4 space-y-4">
              {selectedAddress && !isChangingAddress ? (
                // Selected Address View
                <div className="border border-black rounded-xl p-4 bg-gray-50 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm mb-2 text-gray-900">
                        Delivering to:
                      </h3>
                      <p className="font-bold text-sm capitalize">
                        {selectedAddress.firstName ||
                          selectedAddress.name ||
                          "Name Not Set"}{" "}
                        {selectedAddress.lastName || ""}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedAddress.streetAddress || "Address Not Set"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAddress.city || "City"},{" "}
                        {selectedAddress.state || "State"} -{" "}
                        {selectedAddress.zipCode || "Zip"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        Mobile: {selectedAddress.mobile || "N/A"}
                      </p>
                    </div>
                    <FaCheckCircle className="text-black text-xl" />
                  </div>
                  <button
                    onClick={() => setIsChangingAddress(true)}
                    className="mt-4 w-full border border-gray-300 py-2 rounded-lg text-sm font-bold hover:bg-white transition-colors"
                  >
                    Change / Add Address
                  </button>
                </div>
              ) : (
                // Full List / Add View
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm">
                      Select Delivery Address
                    </h3>
                    {selectedAddress && (
                      <button
                        onClick={() => setIsChangingAddress(false)}
                        className="text-xs text-gray-500 underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>

                  {/* Add Address Button */}
                  {!isAddressFormOpen && (
                    <button
                      onClick={() => setIsAddressFormOpen(true)}
                      className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-4 text-gray-600 hover:border-black hover:text-black transition-colors"
                    >
                      <MdAdd size={20} />
                      <span className="font-medium">Add New Address</span>
                    </button>
                  )}

                  {/* Address Form */}
                  {isAddressFormOpen && (
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                      <h3 className="font-bold mb-2">New Address</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="firstName"
                          placeholder="First Name"
                          value={addressFormData.firstName}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                        <input
                          name="lastName"
                          placeholder="Last Name"
                          value={addressFormData.lastName}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                      </div>
                      <input
                        name="streetAddress"
                        placeholder="Street Address"
                        value={addressFormData.streetAddress}
                        onChange={handleAddressFormChange}
                        className="border p-2 rounded w-full text-sm"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="city"
                          placeholder="City"
                          value={addressFormData.city}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                        <input
                          name="state"
                          placeholder="State"
                          value={addressFormData.state}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={addressFormData.zipCode}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                        <input
                          name="mobile"
                          placeholder="Mobile Number"
                          value={addressFormData.mobile}
                          onChange={handleAddressFormChange}
                          className="border p-2 rounded w-full text-sm"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={handleSaveAddress}
                          className="bg-black text-white px-4 py-2 rounded text-sm font-bold flex-1"
                        >
                          Save Address
                        </button>
                        <button
                          onClick={() => setIsAddressFormOpen(false)}
                          className="border border-gray-300 px-4 py-2 rounded text-sm font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Addresses */}
                  <div className="space-y-3">
                    {user?.addresses?.map((addr) => (
                      <div
                        key={addr._id}
                        onClick={() => {
                          setSelectedAddress(addr);
                          setIsChangingAddress(false);
                          setIsAddressFormOpen(false);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress?._id === addr._id
                            ? "border-black bg-gray-50 ring-1 ring-black"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-bold text-sm">
                              {addr.firstName} {addr.lastName}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              {addr.streetAddress}
                            </p>
                            <p className="text-sm text-gray-600">
                              {addr.city}, {addr.state} - {addr.zipCode}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Mobile: {addr.mobile}
                            </p>
                          </div>
                          {selectedAddress?._id === addr._id && (
                            <FaCheckCircle className="text-black" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cartItems && cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-100 absolute bottom-0 w-full rounded-t-xl shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
            {/* Total Summary Row */}
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-xs text-gray-500">Total Payable</p>
                <p className="text-xl font-bold">
                  ₹{totalPayable.toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="text-xs font-bold underline flex items-center gap-1"
              >
                View Details{" "}
                <MdKeyboardArrowDown
                  className={`transition-transform ${
                    isDetailsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Details Dropdown */}
            {isDetailsOpen && (
              <div className="text-sm space-y-2 mb-4 bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCharges === 0 ? "FREE" : `₹${shippingCharges}`}
                  </span>
                </div>
              </div>
            )}

            {step === 1 ? (
              <button
                onClick={() => setStep(2)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg"
              >
                Checkout
              </button>
            ) : (
              <button
                onClick={handlePayment}
                disabled={!selectedAddress}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            )}
          </div>
        )}
      </div>
      <ViewAllOffers
        isOpen={isOffersOpen}
        onClose={() => setIsOffersOpen(false)}
        currentCouponCode={cart?.couponCode}
      />
    </div>
  );
}

export default CartDrawer;