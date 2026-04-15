import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  getOrderById,
  cancelOrder,
  returnOrder,
} from "../Redux/Customers/Order/Action"; // Ensure this action handles single order fetch
import { MdCancel, MdArrowBack } from "react-icons/md";
import OrderStatusStepper from "./OrderStatusStepper";
import ReturnRequestModal from "./ReturnRequestModal";
import RateProductModal from "./RateProductModal";

const OrderDetails = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((store) => store.order);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    dispatch(getOrderById(orderId));
  }, [dispatch, orderId]);

  const isCancelled = order?.orderStatus === "CANCELLED";
  const isReturned = order?.orderStatus?.includes("RETURN");

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (!order || error)
    return (
      <div className="text-center p-10">
        Order not found or error loading details.
      </div>
    );

  const handleCancelOrder = () => {
    dispatch(cancelOrder(orderId));
  };

  const handleReturnOrder = () => {
    setIsReturnModalOpen(true);
  };

  const handleRateProduct = (productId) => {
    setSelectedProductId(productId);
    setIsRateModalOpen(true);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        {/* Breadcrumb / Back */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link
              to="/orders"
              className="hover:text-black flex items-center gap-1"
            >
              <MdArrowBack /> Back to Orders
            </Link>
            <span>/</span>
            <span className="text-black font-semibold">Order #{order._id}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {order.orderStatus !== "DELIVERED" &&
              order.orderStatus !== "SHIPPED" &&
              order.orderStatus !== "CANCELLED" &&
              order.orderStatus !== "COMPLETED" &&
              order.orderStatus !== "COMPLETED" &&
              order.orderStatus !== "OUT_FOR_DELIVERY" &&
              order.returnStatus === "NONE" && (
                <button
                  onClick={handleCancelOrder}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                >
                  <MdCancel /> Cancel Order
                </button>
              )}

            {order.orderStatus === "DELIVERED" &&
              order.returnStatus === "NONE" && (
                <button
                  onClick={handleReturnOrder}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  Return / Exchange
                </button>
              )}

            {order.returnStatus === "REQUESTED" && (
              <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-medium text-sm">
                {order.returnRequestType === "EXCHANGE"
                  ? "Exchange Requested"
                  : "Return Requested"}
              </span>
            )}

            {order.returnStatus === "APPROVED" && (
              <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium text-sm">
                {order.returnRequestType === "EXCHANGE"
                  ? "Exchange Approved"
                  : "Return Approved"}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Status Stepper */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-6">Order Status</h2>
              <div className="w-full">
                <OrderStatusStepper
                  orderStatus={order.orderStatus}
                  isCancelled={isCancelled}
                  order={order} // Pass full order for return type check
                />
              </div>
            </div>

            {/* Items */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-800">
                  Order Items ({order.totalItem})
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="p-6 flex gap-4">
                    <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0">
                      {item.product?.imageUrl ||
                      item.product?.variants?.[0]?.images?.[0] ? (
                        <img
                          src={
                            item.product.imageUrl ||
                            item.product.variants[0].images[0]
                          }
                          alt={item.product?.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <h3 className="font-medium text-gray-900">
                        {item.product?.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.product?.brand}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-semibold">Size:</span>{" "}
                          {item.size}
                        </p>
                        <p>
                          <span className="font-semibold">Qty:</span>{" "}
                          {item.quantity}
                        </p>
                      </div>
                      <div className="mt-auto flex justify-between items-center">
                        <p className="font-bold text-gray-900">
                          ₹
                          {(item.discountedPrice || item.price)?.toLocaleString(
                            "en-IN",
                            {
                              maximumFractionDigits: 2,
                              minimumFractionDigits: 2,
                            },
                          )}
                        </p>
                        <Link
                          to={`/product/${item.product?._id}`}
                          className="text-xs font-bold text-[#8A2BE2] border border-[#8A2BE2] px-3 py-1 rounded hover:bg-[#8A2BE2] hover:text-white transition-colors"
                        >
                          View Details
                        </Link>
                        {order.orderStatus === "DELIVERED" && (
                          <button
                            onClick={() => handleRateProduct(item.product?._id)}
                            className="ml-2 text-xs font-bold text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-white transition-colors"
                          >
                            Write Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Address */}
          <div className="space-y-6">
            {/* Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Shipping Address</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="font-bold text-black">
                  {order.shippingAddress?.firstName}{" "}
                  {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.streetAddress}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state}
                </p>
                <p>{order.shippingAddress?.zipCode}</p>
                <p className="mt-2 text-black font-medium">
                  Mobile: {order.shippingAddress?.mobile}
                </p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Price Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price</span>
                  <span className="font-medium">
                    ₹
                    {order.totalPrice?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">
                    -₹
                    {order.discount?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>
                    ₹
                    {order.totalDiscountedPrice?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2">
                Payment Information
              </h3>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Status:</span>
                <span
                  className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                    order.paymentDetails?.paymentStatus === "COMPLETED"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentDetails?.paymentStatus || "PENDING"}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Transaction ID:</span>{" "}
                <span className="text-xs">
                  {order.paymentDetails?.razorpayPaymentId || "N/A"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ReturnRequestModal
        open={isReturnModalOpen}
        handleClose={() => setIsReturnModalOpen(false)}
        orderId={orderId}
      />
      <RateProductModal
        open={isRateModalOpen}
        handleClose={() => setIsRateModalOpen(false)}
        productId={selectedProductId}
      />
    </>
  );
};

export default OrderDetails;