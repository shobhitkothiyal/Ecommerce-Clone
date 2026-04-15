import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaPlus, FaCheck } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";

import { getUserOrders } from "../Redux/Customers/Order/Action";
import { getUserAddresses } from "../Redux/Auth/actions";
import OrderStatusStepper from "./OrderStatusStepper";

const OrderHistory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [user, setUser] = useState({ firstName: "", lastName: "", email: "" });
  const { orders, loading } = useSelector((store) => store.order);
  const { user: authUser } = useSelector((store) => store.auth);

  useEffect(() => {
    // Fetch user details
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser({ firstName: "User", lastName: "", email: "user@example.com" });
    }

    // Fetch orders and addresses
    dispatch(getUserOrders());
    dispatch(getUserAddresses());
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="max-w-[1390px] mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-serif text-center mb-2">My Account</h1>
      <div className="flex justify-center text-sm text-gray-500 mb-12 gap-2">
        <Link to="/" className="hover:text-black">
          Home
        </Link>
        <span>&gt;</span>
        <span>Account</span>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="flex flex-col border-l-2 border-transparent">
            <Link
              to="/orders"
              className="pl-4 py-2 font-bold text-black border-l-2 border-black -ml-[2px]"
            >
              Dashboard
            </Link>
            <Link
              to="/account/addresses"
              className="pl-4 py-2 text-gray-500 hover:text-black transition-colors"
            >
              Addresses
            </Link>
            <button
              onClick={handleLogout}
              className="pl-4 py-2 text-gray-500 hover:text-black transition-colors text-left"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <p className="mb-6 text-gray-600">
            Hello {user.firstName} (not {user.firstName}?{" "}
            <button
              onClick={handleLogout}
              className="underline text-gray-800 hover:text-black"
            >
              Log Out
            </button>
            )
          </p>

          <h2 className="text-2xl font-serif mb-4">Order History</h2>

          {loading ? (
            <p>Loading orders...</p>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-4 mb-12">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/account/order/${order._id}`)}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-all cursor-pointer bg-white"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-bold text-lg">
                        {order.orderItems?.[0]?.product?.title || "Order"}
                        {order.orderItems?.length > 1 &&
                          ` & ${order.orderItems.length - 1} more`}
                      </p>
                      <MdArrowBack className="rotate-180 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 mt-2">
                      {order.orderItems.map((item) => (
                        <div key={item._id} className="relative group">
                          <img
                            src={item.product?.variants?.[0]?.images?.[0] || ""}
                            alt={item.product?.title}
                            className="w-12 h-12 object-cover rounded border border-gray-100"
                          />
                          <span className="absolute -top-1 -right-1 bg-gray-200 text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-4 min-w-[200px]">
                    <p className="font-bold text-lg">
                      ₹{order.totalDiscountedPrice || order.totalPrice}
                    </p>

                    {/* Stepper Display */}
                    <div className="w-full">
                      <OrderStatusStepper
                        orderStatus={order.orderStatus}
                        isCancelled={order.orderStatus === "CANCELLED"}
                        order={order}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-[#e8f5e9] border border-[#c8e6c9] text-[#2e7d32] px-4 py-3 rounded flex items-center gap-2 mb-12">
              <FaCheck size={12} />
              <span className="text-sm border-b border-[#2e7d32]">
                Make your first order.
              </span>
              <span className="text-sm">
                You haven't placed any orders yet.
              </span>
            </div>
          )}

          <h2 className="text-2xl font-serif mb-4">Account Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 max-w-2xl border-b border-gray-200 pb-8 mb-8">
            <div>
              <h3 className="text-sm font-bold mb-1">Name</h3>
              <p className="text-gray-600">
                {user.firstName} {user.lastName}
              </p>
            </div>
            <div>
              {/* Empty for layout balance if needed, or remove grid */}
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1">Email</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <Link to="/account/addresses">
            <button className="bg-black text-white px-8 py-3 font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">
              View Addresses ({authUser?.addresses?.length || 0})
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;