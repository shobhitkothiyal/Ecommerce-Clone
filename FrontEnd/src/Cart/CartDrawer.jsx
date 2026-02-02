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
    const [activeDropdown, setActiveDropdown] = useState(null); // { itemId, type: 'size' | 'color' }

    const handleApplyCoupon = () => {
        dispatch(applyCouponAction(couponCode));
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (activeDropdown && !e.target.closest('.custom-dropdown-container')) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeDropdown]);

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

    const handleUpdateSize = (cartItemId, size) => {
        dispatch(updateCartItem({ cartItemId, data: { size } }));
    };

    const handleUpdateColor = (cartItemId, variantId) => {
        dispatch(updateCartItem({ cartItemId, data: { variant: variantId } }));
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

            // Totals calculation - Use component level subtotal for robustness
            let activeDiscountPercent = 0;
            const discountThreshold1 = 3999;
            const discountThreshold2 = 8999;

            if (subtotal >= discountThreshold2) activeDiscountPercent = 15;
            else if (subtotal >= discountThreshold1) activeDiscountPercent = 12;

            // Ensure we use the exact same logic as displayed
            let calcDiscountAmount = 0;
            if (cart?.couponCode) {
                calcDiscountAmount = cart.couponDiscount || (cart.totalPrice - cart.totalDiscountedPrice) || 0;
            } else if (activeDiscountPercent === 12) {
                calcDiscountAmount = (discountThreshold1 * 12) / 100;
            } else if (activeDiscountPercent === 15) {
                calcDiscountAmount = (discountThreshold2 * 15) / 100;
            }

            const calcFinalTotal = subtotal - calcDiscountAmount;
            const calcShippingCharges = calcFinalTotal > 3999 ? 0 : 50;
            const payableAmount = calcFinalTotal + calcShippingCharges;

            if (payableAmount <= 0) {
                alert("Invalid payable amount.");
                return;
            }

            // 1. Create Order Link
            const orderResponse = await axios.post(
                `${API_BASE_URL}/payments/create-order`,
                { amount: payableAmount, currency: "INR" },
                { headers: { Authorization: `Bearer ${token}` } },
            );

            const {
                id: razorpayOrderId,
                amount: razorpayAmount,
                currency,
            } = orderResponse.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_R7AbhwIhpDdPws",
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
                                shippingAddress: selectedAddress,
                            },
                            { headers: { Authorization: `Bearer ${token}` } },
                        );

                        if (verifyResponse.data.success) {
                            const orderId = verifyResponse.data.order._id;
                            setIsCartOpen(false);
                            setStep(1);
                            navigate(`/order-success/${orderId}`);
                        }
                    } catch (error) {
                        console.error("Payment verification failed", error);
                        alert("Payment verification failed: " + (error.response?.data?.error || error.message));
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
            alert("Could not initiate payment: " + (error.response?.data?.error || error.message));
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

    //confetti
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
        <div
            className="fixed inset-0 z-[1000] flex justify-end bg-black/60 backdrop-blur-sm overflow-hidden"
            onClick={() => setIsCartOpen(false)}
        >
            {/* Drawer Content */}
            <div
                className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden relative"
                onClick={(e) => e.stopPropagation()}
            >
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
                                    <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                                        <div
                                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold z-10 transition-colors duration-300 ${progressPercent >= 50
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
                                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-bold z-10 transition-colors duration-300 ${progressPercent >= 100
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
                                                    className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 relative shadow-sm hover:shadow-md transition-shadow"
                                                >
                                                    {/* Image */}
                                                    <div className="w-24 h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden shadow-inner relative group/img">
                                                        <img
                                                            key={activeVariant._id}
                                                            src={activeVariant.images?.[0] || ""}
                                                            alt={fullProduct.title}
                                                            className="w-full h-full object-cover transition-all duration-500 group-hover/img:scale-110 animate-in fade-in zoom-in-95"
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors duration-300" />
                                                    </div>

                                                    {/* Details Column */}
                                                    <div className="flex-1 flex flex-col min-w-1">
                                                        {/* Title & Price Row */}
                                                        <div className="flex justify-between items-start gap-4 mb-3">
                                                            <h3 className="font-semibold text-sm md:text-base leading-tight text-gray-900 line-clamp-2">
                                                                {fullProduct.title}
                                                            </h3>
                                                            <div className="text-right shrink-0">
                                                                <p className="text-xs text-gray-400 line-through font-medium">
                                                                    ₹{activeVariant.price.toLocaleString()}
                                                                </p>
                                                                <p className="font-bold text-base text-gray-900 leading-tight">
                                                                    ₹{Math.round(
                                                                        activeVariant.price -
                                                                        (activeVariant.price *
                                                                            (fullProduct.discountedPercent || 0)) / 100
                                                                    ).toLocaleString()}
                                                                </p>
                                                                {(fullProduct.discountedPercent || 0) > 0 && (
                                                                    <p className="text-[11px] font-extrabold text-[#10855c] uppercase text-right leading-none mt-1">
                                                                        {cart?.couponCode ? "Coupon Applied" : `(${fullProduct.discountedPercent}% OFF)`}
                                                                    </p>
                                                                )}

                                                                {cart?.couponCode && (
                                                                    <div className="flex items-center justify-end gap-1 mt-1.5">
                                                                        <div className="bg-[#e8f5f0] text-[#10855c] px-2 py-1 rounded-md text-[9px] font-black tracking-widest flex items-center gap-1.5 border border-[#d1e9e0] uppercase">
                                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                                                                                <path d="M2.25 18.75a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75v-2.25zM2.25 5.25a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25v2.25a.75.75 0 01-.75.75H3a.75.75 0 01-.75-.75V5.25zM2.25 9.75v3.75a.75.75 0 00.75.75h.75a2.25 2.25 0 012.25 2.25V18h11.25v-1.5a2.25 2.25 0 012.25-2.25h.75a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75H17.25a2.25 2.25 0 01-2.25-2.25V6h-11.25v.75a2.25 2.25 0 01-2.25 2.25H3a.75.75 0 00-.75.75z" />
                                                                            </svg>
                                                                            {cart.couponCode}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between items-end">
                                                            {/* Selectors */}
                                                            <div className="flex flex-col gap-2.5">
                                                                {/* Size Selector */}
                                                                <div className="relative custom-dropdown-container">
                                                                    <div
                                                                        onClick={() => setActiveDropdown(activeDropdown?.itemId === item._id && activeDropdown?.type === 'size' ? null : { itemId: item._id, type: 'size' })}
                                                                        className={`flex items-center group/btn bg-stone-50 border rounded-lg px-2.5 py-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md active:scale-90 ${activeDropdown?.itemId === item._id && activeDropdown?.type === 'size' ? ' bg-white' : 'border-gray-200'}`}
                                                                    >
                                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-1.5 border-r border-gray-200 pr-1.5 leading-none group-hover/btn:text-gray-600 transition-colors">Size</span>
                                                                        <div className="flex items-center relative pr-5 min-w-[30px]">
                                                                            <span className="text-[10px] font-black group-hover/btn:text-black transition-colors">{item.size}</span>
                                                                            <MdKeyboardArrowDown
                                                                                className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-300 ${activeDropdown?.itemId === item._id && activeDropdown?.type === 'size' ? 'rotate-180 text-black' : 'text-gray-600 group-hover/btn:text-black'}`}
                                                                                size={14}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Size Options Menu (Drop Down Menu) */}
                                                                    {activeDropdown?.itemId === item._id && activeDropdown?.type === 'size' && (
                                                                        <div className="absolute left-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ring-1 ring-black/5">
                                                                            {Object.keys(activeVariant.stock || {}).map((sz) => (
                                                                                <button
                                                                                    key={sz}
                                                                                    onClick={() => {
                                                                                        handleUpdateSize(item._id, sz);
                                                                                        setActiveDropdown(null);
                                                                                    }}
                                                                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-black transition-all flex items-center justify-between group/opt ${item.size === sz ? 'bg-black text-white' : 'hover:bg-stone-50 text-gray-600 hover:text-black focus:bg-stone-100'}`}
                                                                                >
                                                                                    <span className="transition-transform group-hover/opt:translate-x-0.5">{sz}</span>
                                                                                    {item.size === sz && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" />}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Color Selector */}
                                                                <div className="relative custom-dropdown-container">
                                                                    <div
                                                                        onClick={() => setActiveDropdown(activeDropdown?.itemId === item._id && activeDropdown?.type === 'color' ? null : { itemId: item._id, type: 'color' })}
                                                                        className={`flex items-center group/btn bg-stone-50 border rounded-lg px-2.5 py-1.5 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md hover:border-black active:scale-95 ${activeDropdown?.itemId === item._id && activeDropdown?.type === 'color' ? 'border-black ring-1 ring-black bg-white' : 'border-gray-200'}`}
                                                                    >
                                                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-1.5 border-r border-gray-200 pr-1.5 leading-none group-hover/btn:text-gray-600 transition-colors">Color</span>

                                                                        {/* Color Dot Swatch */}
                                                                        <div className="w-2.5 h-2.5 rounded-full mr-1.5 shrink-0 border border-white shadow-[0_0_3px_rgba(0,0,0,0.15)] ring-1 ring-black/5 relative overflow-hidden">
                                                                            {Array.isArray(activeVariant.colors) && activeVariant.colors.length === 2 ? (
                                                                                <>
                                                                                    <span className="absolute inset-0" style={{ backgroundColor: activeVariant.colors[1] }} />
                                                                                    <span className="absolute inset-0" style={{ backgroundColor: activeVariant.colors[0], clipPath: "ellipse(95% 70% at 0% 0%)" }} />
                                                                                </>
                                                                            ) : (
                                                                                <div className="w-full h-full" style={{ backgroundColor: activeVariant.hex || activeVariant.colors?.[0] || "#000" }} />
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center relative pr-5 min-w-[50px]">
                                                                            <span className="text-[10px] font-black capitalize group-hover/btn:text-black transition-colors">{activeVariant.color}</span>
                                                                            <MdKeyboardArrowDown
                                                                                className={`absolute right-0 top-1/2 -translate-y-1/2 transition-transform duration-300 ${activeDropdown?.itemId === item._id && activeDropdown?.type === 'color' ? 'rotate-180 text-black' : 'text-gray-600 group-hover/btn:text-black'}`}
                                                                                size={14}
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    {/* Color Options Menu */}
                                                                    {activeDropdown?.itemId === item._id && activeDropdown?.type === 'color' && (
                                                                        <div className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-[100] py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-56 overflow-y-auto custom-scrollbar ring-1 ring-black/5">
                                                                            {fullProduct.variants?.map((v) => (
                                                                                <button
                                                                                    key={v._id}
                                                                                    onClick={() => {
                                                                                        handleUpdateColor(item._id, v._id);
                                                                                        setActiveDropdown(null);
                                                                                    }}
                                                                                    className={`w-full text-left px-4 py-2.5 text-[10px] font-black transition-all flex items-center gap-3 group/opt ${activeVariant._id === v._id ? 'bg-black text-white' : 'hover:bg-stone-50 text-gray-600 hover:text-black focus:bg-stone-100'}`}
                                                                                >
                                                                                    <div className="w-3 h-3 rounded-full border border-white shadow-[0_0_3px_rgba(0,0,0,0.2)] ring-1 ring-black/5 transition-transform group-hover/opt:scale-110 relative overflow-hidden shrink-0">
                                                                                        {Array.isArray(v.colors) && v.colors.length === 2 ? (
                                                                                            <>
                                                                                                <span className="absolute inset-0" style={{ backgroundColor: v.colors[1] }} />
                                                                                                <span className="absolute inset-0" style={{ backgroundColor: v.colors[0], clipPath: "ellipse(95% 70% at 0% 0%)" }} />
                                                                                            </>
                                                                                        ) : (
                                                                                            <div className="w-full h-full" style={{ backgroundColor: v.hex || v.colors?.[0] || "#000" }} />
                                                                                        )}
                                                                                    </div>
                                                                                    <span className="capitalize flex-1 truncate transition-transform group-hover/opt:translate-x-0.5">{v.color}</span>
                                                                                    {activeVariant._id === v._id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_5px_rgba(255,255,255,0.5)]" />}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Actions Row */}
                                                            <div className="flex items-center gap-2">
                                                                {/* Quantity Pill or increase and decrese count button */}
                                                                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm px-0.5 py-0.5 mt-2">
                                                                    <button
                                                                        onClick={() => handleUpdateQty(item._id, item.quantity - 1)}
                                                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all disabled:opacity-30"
                                                                        disabled={item.quantity <= 1}
                                                                    >
                                                                        <span className="text-base font-bold">-</span>
                                                                    </button>
                                                                    <span className="text-[10px] font-black w-6 text-center text-gray-900">
                                                                        {item.quantity}
                                                                    </span>
                                                                    <button
                                                                        onClick={() => handleUpdateQty(item._id, item.quantity + 1)}
                                                                        className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-white rounded-md transition-all"
                                                                    >
                                                                        <span className="text-base font-bold">+</span>
                                                                    </button>
                                                                </div>

                                                                {/* Delete Cart Item */}
                                                                <button
                                                                    onClick={() => handleRemoveItem(item._id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-all p-1.5 hover:bg-red-50 rounded-lg mt-2 group"
                                                                >
                                                                    <MdDeleteOutline size={20} className="group-active:scale-90 transition-transform" />
                                                                </button>
                                                            </div>
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

                                    {/* Coupon Section */}
                                    <div className="bg-white p-5 space-y-4 mb-2 shadow-sm rounded-b-2xl border-t border-gray-50">
                                        <div className="flex flex-col gap-4">
                                            {/* Applied Coupon Display */}
                                            {(activeDiscountPercent > 0 || cart?.couponCode) && (
                                                <div className="bg-[#f3f9f6] border border-[#e6f4ed] rounded-xl p-4 flex items-center justify-between animate-fade-in shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-[#10855c] w-6 h-6 rounded-full flex items-center justify-center shadow-sm">
                                                            <span className="text-white text-[12px] font-black italic">%</span>
                                                        </div>
                                                        <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                                                            {cart?.couponCode || activeCouponCode} <span className="font-medium text-gray-500">applied</span>
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold text-[#10855c] bg-[#e8f5f0] px-3 py-1.5 rounded-lg border border-[#d1e9e0]">
                                                        Saved ₹{discountAmount.toLocaleString(undefined, {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Coupon Input Field */}
                                            {!cart?.couponCode && (
                                                <div className="relative group/input">
                                                    <div className="flex items-center border border-gray-300 rounded-xl focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all bg-white shadow-sm h-[58px]">
                                                        <div className="pl-4 pr-3 text-[#10855c]">
                                                            <div className="w-6 h-6 rounded-full border-2 border-[#10855c] flex items-center justify-center font-black italic text-[10px]">
                                                                %
                                                            </div>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            placeholder="Enter Coupon Code"
                                                            value={couponCode}
                                                            onChange={(e) => setCouponCode(e.target.value)}
                                                            className="flex-1 bg-transparent border-none focus:outline-none placeholder:text-gray-400 font-bold text-gray-900 text-[15px] pb-0.5"
                                                        />
                                                        <button
                                                            onClick={handleApplyCoupon}
                                                            disabled={!couponCode}
                                                            className="h-full px-6 text-black hover:text-gray-600 font-black text-xs uppercase tracking-widest disabled:opacity-30 transition-colors"
                                                        >
                                                            Apply
                                                        </button>
                                                    </div>
                                                </div>
                                            )}

                                            {/* View Offers Link */}
                                            <div className="flex flex-col items-center gap-2">
                                                <button
                                                    onClick={() => setIsOffersOpen(true)}
                                                    className="w-full text-center text-[#2857e3] text-sm font-black hover:underline flex items-center justify-center gap-1 mt-1 group"
                                                >
                                                    View All Offers
                                                    <MdKeyboardArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                                </button>

                                                {cart?.couponCode && (
                                                    <button
                                                        onClick={() => dispatch(removeCouponAction())}
                                                        className="text-[10px] text-red-500 font-bold uppercase tracking-widest hover:text-red-700 transition-colors py-1 flex items-center gap-1"
                                                    >
                                                        <MdDeleteOutline size={14} /> Remove Applied Coupon
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {(cart?.couponError || error) && (
                                            <p className="text-red-600 text-xs mt-2 font-bold bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-center gap-2">
                                                <span className="text-red-500">⚠️</span> {cart?.couponError || error}
                                            </p>
                                        )}
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
                                                className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedAddress?._id === addr._id
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
                                    className={`transition-transform ${isDetailsOpen ? "rotate-180" : ""
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
