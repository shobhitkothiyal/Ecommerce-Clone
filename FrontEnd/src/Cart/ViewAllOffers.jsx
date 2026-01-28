import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoupons } from "../Redux/Customers/Coupon/Action.js";
import { applyCoupon } from "../Redux/Customers/Cart/Action.js";
import { MdClose, MdContentCopy, MdCheckCircle } from "react-icons/md";
import { FaTag } from "react-icons/fa";

const ViewAllOffers = ({ isOpen, onClose, currentCouponCode }) => {
  const dispatch = useDispatch();
  const { coupons, loading } = useSelector((state) => state.coupon);
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAllCoupons());
    }
  }, [isOpen, dispatch]);

  const handleApply = (code) => {
    dispatch(applyCoupon(code));
    onClose();
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white text-black sticky top-0 z-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <FaTag className="text-black" /> Available Coupons
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 space-y-4 bg-gray-50 flex-1">
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : coupons && coupons.length > 0 ? (
            coupons.map((coupon) => {
              const isApplied = currentCouponCode === coupon.code;
              return (
                <div
                  key={coupon._id}
                  className="bg-white border boundary-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group hover:border-black transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-md text-sm font-bold tracking-wide uppercase border-dashed">
                      {coupon.code}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopy(coupon.code)}
                        className="text-gray-400 hover:text-black transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode === coupon.code ? (
                          <MdCheckCircle className="text-green-500" />
                        ) : (
                          <MdContentCopy size={16} />
                        )}
                      </button>
                      {isApplied ? (
                        <span className="text-gray-400 text-xs font-bold uppercase cursor-default">
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(coupon.code)}
                          className="text-black text-xs font-bold underline hover:no-underline hover:text-green-600 uppercase"
                        >
                          Apply
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">
                    {coupon.discountType === "percentage"
                      ? `Get ${coupon.discountValue}% OFF`
                      : `Get ₹${coupon.discountValue} OFF`}
                    {coupon.maxDiscountValue
                      ? ` up to ₹${coupon.maxDiscountValue}`
                      : ""}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Min order value: ₹{coupon.minOrderAmount}
                  </p>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No active coupons available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAllOffers;