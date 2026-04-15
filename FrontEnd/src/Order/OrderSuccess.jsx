import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderById } from "../Redux/Customers/Order/Action";
import { FaCheckCircle } from "react-icons/fa";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, loading } = useSelector((store) => store.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [orderId, dispatch]);

  const steps = [
    { label: "Order Placed", status: "COMPLETED", date: order?.createdAt },
    { label: "Processing", status: "PENDING" },
    { label: "Shipped", status: "PENDING" },
    { label: "Delivered", status: "PENDING" },
  ];

  // Simple progress logic (can be refined based on backend status)
  const activeStep = 0; // successfully placed

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 animate-fade-in">
      <div className="text-center mb-12">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
        <h1 className="text-3xl font-serif font-bold mb-2">
          Order Placed Successfully!
        </h1>
        <p className="text-gray-600">
          Thank you for your purchase. Your order ID is{" "}
          <span className="font-bold text-black">#{orderId}</span>
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
        <h2 className="text-lg font-bold mb-6">Order Status</h2>

        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>

          {/* Active Progress */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
            style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
          ></div>

          <div className="flex justify-between items-start">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 bg-white transition-colors duration-300
                            ${index <= activeStep
                      ? "border-green-500 text-green-500"
                      : "border-gray-300 text-gray-400"
                    }
                            `}
                >
                  {index <= activeStep ? (
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <p
                  className={`mt-2 text-xs md:text-sm font-medium ${index <= activeStep ? "text-black" : "text-gray-400"
                    }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {order?.orderItems && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <h2 className="text-lg font-bold mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 shadow-inner">
                  <img
                    src={
                      item.variant?.images?.[0] ||
                      item.product?.variants?.[0]?.images?.[0] ||
                      ""
                    }
                    alt={item.product?.title}
                    className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2">
                    {item.product?.title}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>Size: {item.size}</p>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm mt-2">
                    ₹{item.discountedPrice || item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-center gap-4">
        <Link to="/orders">
          <button className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
            View My Orders
          </button>
        </Link>
        <Link to="/">
          <button className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;