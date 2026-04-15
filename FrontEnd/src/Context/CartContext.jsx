import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedWishlist = localStorage.getItem("wishlist");
    if (storedCart) setCartItems(JSON.parse(storedCart));
    if (storedWishlist) setWishlistItems(JSON.parse(storedWishlist));
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToCart = (product, variant, size, quantity) => {
    setCartItems((prev) => {
      // Check if item already exists (same id, variant color, and size)
      const existingItemIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          item.variant.color === variant.color &&
          item.size === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prev];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prev, { ...product, variant, size, quantity }];
      }
    });
    setIsCartOpen(true); // Open cart when item added
  };

  const removeFromCart = (itemId, variantColor, size) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === itemId &&
            item.variant.color === variantColor &&
            item.size === size
          )
      )
    );
  };

  const updateQuantity = (itemId, variantColor, size, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (
          item.id === itemId &&
          item.variant.color === variantColor &&
          item.size === size
        ) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 0 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const addToWishlist = (product) => {
    setWishlistItems((prev) => {
      if (!prev.find((item) => item.id === product.id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};