import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductCard from "../Product/ProductCard";
import { useNavigate } from "react-router-dom";
import { getUser } from "../Redux/Auth/actions";

function Wishlist() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Ensure we have the latest user data including wishlist
    const token = localStorage.getItem("jwt");
    if (token) {
      dispatch(getUser(token));
    }
  }, [dispatch]);

  const wishlistItems = user?.wishlist || [];

  return (
    <div className="min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-normal mb-4">Wishlist</h1>
        <div className="text-sm text-gray-500 breadcrumbs">
          <span
            className="cursor-pointer hover:text-black"
            onClick={() => navigate("/")}
          >
            Home
          </span>
          <span className="mx-2"> &gt; </span>
          <span>Wishlist</span>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-6">
            No products were added to the wishlist page.
          </p>
          <button
            onClick={() => navigate("/")}
            className="underline hover:text-gray-600 transition-colors"
          >
            Back to shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlistItems.map((product) =>
            product ? (
              <ProductCard key={product.id || product._id} product={product} />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}

export default Wishlist;