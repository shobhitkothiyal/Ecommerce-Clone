import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiFilter, FiX } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import ProductData from "./ProductData.js";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

function Product() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const sortOptions = [
    "Featured",
    "Best selling",
    "Price, low to high",
    "Price, high to low",
    "Date, old to new",
    "Date, new to old",
  ];

  return (
    <div className=" min-h-screen bg-white relative p-5">
      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}

      {/* Top Bar */}
      <div className="bg-[#E5E5E5] rounded-2xl sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center cursor-pointer gap-2 font-medium text-gray-700 hover:text-black transition-colors"
        >
          <FiFilter size={20} />
          <span>Filter</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center cursor-pointer gap-2 text-sm text-gray-700 hover:text-black"
          >
            <span>Sort by : </span>
            <span className="font-medium flex items-center gap-1">
              {sortBy} {isSortOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </span>
          </button>

          {/* Sort Dropdown */}
          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#E5E5E5]/90 backdrop-blur-sm shadow-lg rounded-md overflow-hidden z-30 py-2">
              {sortOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setSortBy(option);
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-white/50 transition-colors ${
                    sortBy === option
                      ? "text-black font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-90 transition-opacity duration-300 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
      )}

      {/* Slide-out Filter Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white/80 backdrop-blur-md z-9999 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isFilterOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col bg-[#E5E5E5]">
          {/* Sidebar Header */}
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-xl font-bold">Filters</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Sidebar Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8 custom-scrollbar">
            {/* Color Section */}
            <div>
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="font-bold text-sm uppercase">Color</h3>
                <IoIosArrowUp />
              </div>
              <div className="space-y-3 max-h-70 overflow-y-auto p-2 pr-2 custom-scrollbar">
                {[
                  { name: "Beige", count: 14, color: "#F5F5DC" },
                  { name: "Black", count: 70, color: "#000000" },
                  { name: "Blue", count: 33, color: "#3B82F6" },
                  { name: "Brown", count: 7, color: "#A52A2A" },
                  { name: "Green", count: 11, color: "#22C55E" },
                  { name: "Grey", count: 4, color: "#808080" },
                  { name: "Maroon", count: 5, color: "#800000" },
                  { name: "Multi", count: 3, type: "multi" },
                  { name: "Mustard", count: 3, color: "#FFDB58" },
                  { name: "Orange", count: 3, color: "#FFA500" },
                  { name: "Pink", count: 3, color: "#FFC0CB" },
                  { name: "Purple", count: 3, color: "#800080" },
                  { name: "Red", count: 12, color: "#FF0000" },
                  { name: "White", count: 12, color: "#FFFFFF" },
                  { name: "Yellow", count: 12, color: "#FFFF00" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 group cursor-pointer"
                  >
                    <div className="relative group/swatch">
                      {item.type === "multi" ? (
                        <div className="w-6 h-6 rounded-full bg-linear-to-r from-yellow-400 via-red-500 to-blue-500 shadow-sm border border-gray-300 transition-all group-hover/swatch:ring-1 group-hover/swatch:ring-offset-2 group-hover/swatch:ring-gray-400"></div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full shadow-sm border border-gray-300 transition-all group-hover/swatch:ring-1 group-hover/swatch:ring-offset-2 group-hover/swatch:ring-gray-400"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      )}
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover/swatch:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                        {item.name}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                      </div>
                    </div>
                    <span className="text-gray-600 text-[15px] group-hover:text-black">
                      {item.name}{" "}
                      <span className="text-gray-400">({item.count})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <div>
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="font-bold text-sm uppercase">Price</h3>
                <IoIosArrowUp />
              </div>
              <div className="space-y-3">
                {[
                  { label: "₹500 - ₹1000", count: 108 },
                  { label: "₹1000 - ₹1500", count: 41 },
                  { label: "₹1500 - ₹2000", count: 77 },
                  { label: "More than ₹2000", count: 85 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-gray-400 rounded bg-transparent checked:bg-black checked:border-black"
                    />
                    <span className="text-gray-600 text-[15px] group-hover:text-black">
                      {item.label}{" "}
                      <span className="text-gray-400">({item.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Section */}
            <div>
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="font-bold text-sm uppercase">Category</h3>
                <IoIosArrowUp />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Bottoms", count: 19 },
                  { label: "Dresses", count: 100 },
                  { label: "Jumpsuits", count: 3 },
                  { label: "Maxi Dress", count: 29 },
                  { label: "Skirts", count: 22 },
                  { label: "Tops", count: 157 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-gray-400 rounded bg-transparent checked:bg-black checked:border-black"
                    />
                    <span className="text-gray-600 text-[15px] group-hover:text-black">
                      {item.label}{" "}
                      <span className="text-gray-400">({item.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Discount Section */}
            <div>
              <div className="flex items-center justify-between mb-4 cursor-pointer">
                <h3 className="font-bold text-sm uppercase">Discount</h3>
                <IoIosArrowUp />
              </div>
              <div className="space-y-3 pb-8">
                {[
                  { label: "Up to 10%", count: 4 },
                  { label: "20 - 40%", count: 24 },
                  { label: "40% and above", count: 274 },
                ].map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 border-gray-400 rounded bg-transparent checked:bg-black checked:border-black"
                    />
                    <span className="text-gray-600 text-[15px] group-hover:text-black">
                      {item.label}{" "}
                      <span className="text-gray-400">({item.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ProductData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Product;