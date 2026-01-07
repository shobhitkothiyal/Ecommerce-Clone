import React from "react";
import { FiX, FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.variant.basePrice;
    const discount = item.discountedPercent || 0;
    const discountedPrice = Math.round(price - (price * discount) / 100);
    return acc + discountedPrice * item.quantity;
  }, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold">
            Your Cart ({cartItems.length} items)
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-gray-500">Your cart is empty.</p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/");
                }}
                className="bg-black text-white px-6 py-3 font-medium hover:bg-gray-800 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const price = item.variant.basePrice;
              const discount = item.discountedPercent || 0;
              const discountedPrice = Math.round(
                price - (price * discount) / 100
              );

              return (
                <div key={index} className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-32 shrink-0 bg-gray-50 rounded-md overflow-hidden">
                    <img
                      src={item.variant.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {item.title}
                        </h3>
                        <button
                          onClick={() =>
                            removeFromCart(
                              item.id,
                              item.variant.color,
                              item.size
                            )
                          }
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.variant.color} / {item.size}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variant.color,
                              item.size,
                              -1
                            )
                          }
                          className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        >
                          <FiMinus size={14} />
                        </button>
                        <span className="px-2 min-w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.variant.color,
                              item.size,
                              1
                            )
                          }
                          className="px-2 py-1 hover:bg-gray-50 transition-colors"
                        >
                          <FiPlus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹ {(discountedPrice * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold">
                ₹ {subtotal.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4 text-center">
              Tax included. Shipping calculated at checkout.
            </p>
            <button className="w-full bg-black text-white py-4 font-bold tracking-wide hover:bg-gray-800 transition-colors uppercase">
              Check Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
