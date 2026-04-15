import React from "react";
import { HeaderNavigation } from "../Navigation/HeaderNavigations";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import AuthModal from "../Components/AuthModal/AuthModal.jsx";
import { MdOutlineShoppingBag } from "react-icons/md";
import { IoLogOutOutline, IoBagHandleOutline } from "react-icons/io5";
import { logout } from "../Redux/Auth/actions.js";

import {
  FaSearch,
  FaRegStar,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";

function Header() {
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();//cart context
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);//auth modal state
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);//orders loading state
  const [showProfileMenu, setShowProfileMenu] = useState(false);//profile menu state
  const dispatch = useDispatch();
  const { user, token } = useSelector((store) => store.auth);
  const { cartItems, cart } = useSelector((store) => store.cart);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const wishlistCount = user?.wishlist?.length || 0;

  // Calculate total quantity of items in cart
  const cartItemCount = cartItems?.reduce((acc, item) => acc + (item.quantity || 0), 0) || cart?.totalItem || 0;

  const menuRef = useRef(null);//menu reference

  const isLoggedIn = !!token;

  const handleLogout = () => {
    dispatch(logout());
    setShowProfileMenu(false);
    navigate("/");
  };

  useEffect(() => {
    // Close menu when clicking outside
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);



  const handleUserClick = () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
    } else {
      navigate("/profile"); // or orders / dashboard
    }
  };

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setShowProfileMenu(!showProfileMenu);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
    setSearchTerm("");
  };

  return (
    <>
      <div className="w-full bg-black text-white text-center py-2">
        <span className="hover:text-gray-400 cursor-pointer">
          up to 80 % off
        </span>
      </div>

      <div className="flex w-full h-20 items-center justify-between">
        <div
          className="flex items-center ml-15 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            className="inline-block "
            sizes="145px"
            srcSet="//uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_180x.png?v=1652706765 180w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_360x.png?v=1652706765 360w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_540x.png?v=1652706765 540w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_720x.png?v=1652706765 720w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_900x.png?v=1652706765 900w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_1080x.png?v=1652706765 1080w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_1296x.png?v=1652706765 1296w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_1512x.png?v=1652706765 1512w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_1728x.png?v=1652706765 1728w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_1944x.png?v=1652706765 1944w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_2160x.png?v=1652706765 2160w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_2376x.png?v=1652706765 2376w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_2592x.png?v=1652706765 2592w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_2808x.png?v=1652706765 2808w, //uptownie.com/cdn/shop/files/uptownie_logo_updated_v3_2880x.png?v=1652706765 2880w"
          ></img>
        </div>
        <div className="flex items-end  gap-4 cursor-pointer mr-10">
          <div className="relative ">
            {/* SEARCH ICON */}
            {!isSearchOpen && (
              <div className="cursor-pointer" onClick={toggleSearch}>
                <svg
                  className="w-4.5 h-4.5 flex"
                  fill="currentColor"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  {" "}
                  <path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>{" "}
                </svg>
              </div>
            )}

            {/* SEARCH BAR */}
            {isSearchOpen && (
              <div
                className={`
    absolute right-0 -top-3 -translate-y-1/2 w-200
    bg-white border border-black flex items-center px-4 py-2 z-50
    transition-all duration-500 ease-out
    ${isSearchOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-10 pointer-events-none"}
  `}
              >
                <input
                  type="text"
                  placeholder="Search products"
                  className="w-full outline-none text-black text-sm"
                  autoFocus
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchTerm.trim()) {
                      navigate(`/pdt/search?q=${searchTerm}`);
                      setIsSearchOpen(false);
                      setSearchTerm("");
                    }
                  }}
                />

                {/* SEARCH ICON */}
                <svg className="w-4.5 h-4.5 flex" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" > <path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path> </svg>

                {/* CLOSE */}
                <button
                  onClick={toggleSearch}
                  className="ml-4 text-black text-lg"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* User/Profile Icon */}
          <div
            className="relative group cursor-pointer"
            ref={menuRef}
            onClick={handleAccountClick} // ✅ FIX
          >
            {isLoggedIn ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="svgkp"
              >
                <path
                  d="M22.9129 12.935L13.7571 23.0474C13.5348 23.2929 13.1284 23.1084 13.1669 22.7794L14.0816 14.9731H10.6991C10.4034 14.9731 10.2484 14.6219 10.4478 14.4035L20.3133 3.59739C20.5589 3.32834 20.9984 3.58134 20.8891 3.92887L18.2354 12.3664H22.6607C22.9557 12.3664 23.1109 12.7163 22.9129 12.935Z"
                  fill="#FEA203"
                ></path>
                <path
                  id="svgkp-path"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.6079 5.35819C16.4805 5.1933 16.3421 5.03582 16.1932 4.8869C15.2702 3.96387 14.0183 3.44531 12.7129 3.44531C11.4075 3.44531 10.1556 3.96387 9.2326 4.8869C8.30957 5.80993 7.79102 7.06183 7.79102 8.36719C7.79102 9.67255 8.30957 10.9244 9.2326 11.8475C9.48368 12.0986 9.75909 12.3197 10.0533 12.5086L11.0235 11.4503C10.7335 11.2914 10.4649 11.0911 10.227 10.8531C9.56766 10.1938 9.19727 9.29959 9.19727 8.36719C9.19727 7.43479 9.56766 6.54057 10.227 5.88127C10.8863 5.22196 11.7805 4.85156 12.7129 4.85156C13.6453 4.85156 14.5395 5.22196 15.1988 5.88127C15.3636 6.04604 15.5103 6.22549 15.6377 6.41654L16.6079 5.35819ZM20.6413 18.6497L19.6746 19.7132C20.1676 20.4122 20.4473 21.2264 20.4473 22.0781V23.8359C20.4473 24.2243 20.7621 24.5391 21.1504 24.5391C21.5387 24.5391 21.8535 24.2243 21.8535 23.8359V22.0781C21.8535 20.7863 21.4016 19.6103 20.6413 18.6497ZM12.3111 17.5078H10.3026C7.27113 17.5078 4.97852 19.6394 4.97852 22.0781V23.8359C4.97852 24.2243 4.66372 24.5391 4.27539 24.5391C3.88707 24.5391 3.57227 24.2243 3.57227 23.8359V22.0781C3.57227 18.6922 6.67684 16.1016 10.3026 16.1016H12.4885L12.3111 17.5078Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
              </svg>

            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                id="svgkp"
              >
                <path
                  d="M22.9129 12.935L13.7571 23.0474C13.5348 23.2929 13.1284 23.1084 13.1669 22.7794L14.0816 14.9731H10.6991C10.4034 14.9731 10.2484 14.6219 10.4478 14.4035L20.3133 3.59739C20.5589 3.32834 20.9984 3.58134 20.8891 3.92887L18.2354 12.3664H22.6607C22.9557 12.3664 23.1109 12.7163 22.9129 12.935Z"
                  fill="#FEA203"
                ></path>
                <path
                  id="svgkp-path"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M16.6079 5.35819C16.4805 5.1933 16.3421 5.03582 16.1932 4.8869C15.2702 3.96387 14.0183 3.44531 12.7129 3.44531C11.4075 3.44531 10.1556 3.96387 9.2326 4.8869C8.30957 5.80993 7.79102 7.06183 7.79102 8.36719C7.79102 9.67255 8.30957 10.9244 9.2326 11.8475C9.48368 12.0986 9.75909 12.3197 10.0533 12.5086L11.0235 11.4503C10.7335 11.2914 10.4649 11.0911 10.227 10.8531C9.56766 10.1938 9.19727 9.29959 9.19727 8.36719C9.19727 7.43479 9.56766 6.54057 10.227 5.88127C10.8863 5.22196 11.7805 4.85156 12.7129 4.85156C13.6453 4.85156 14.5395 5.22196 15.1988 5.88127C15.3636 6.04604 15.5103 6.22549 15.6377 6.41654L16.6079 5.35819ZM20.6413 18.6497L19.6746 19.7132C20.1676 20.4122 20.4473 21.2264 20.4473 22.0781V23.8359C20.4473 24.2243 20.7621 24.5391 21.1504 24.5391C21.5387 24.5391 21.8535 24.2243 21.8535 23.8359V22.0781C21.8535 20.7863 21.4016 19.6103 20.6413 18.6497ZM12.3111 17.5078H10.3026C7.27113 17.5078 4.97852 19.6394 4.97852 22.0781V23.8359C4.97852 24.2243 4.66372 24.5391 4.27539 24.5391C3.88707 24.5391 3.57227 24.2243 3.57227 23.8359V22.0781C3.57227 18.6922 6.67684 16.1016 10.3026 16.1016H12.4885L12.3111 17.5078Z"
                  fill="currentColor"
                  stroke="currentColor"
                ></path>
              </svg>
            )}

            {/* Tooltip */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-12 opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
              <div className="bg-black text-white text-xs px-3 py-2 rounded relative">
                {isLoggedIn ? "Profile" : "Login"}
                <span className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-black rotate-45"></span>
              </div>
            </div>

            {/* Profile Dropdown */}
            {isLoggedIn && showProfileMenu && (
              <div className="absolute top-full right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in">
                <div
                  className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();

                    setIsLoadingOrders(true);
                    setTimeout(() => {
                      setIsLoadingOrders(false);
                      navigate("/orders");
                      setShowProfileMenu(false);
                    }, 800);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <IoBagHandleOutline size={20} />
                    <span className="font-medium text-sm">Order History</span>
                  </div>
                  {isLoadingOrders && (
                    <FaSpinner className="animate-spin text-gray-500" />
                  )}
                </div>
                <div className="h-px bg-gray-100 my-1"></div>
                <div className="px-4 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-2 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all text-sm font-medium"
                  >
                    <span>Logout</span>
                    <IoLogOutOutline size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>


          {/* Wishlist Icon */}
          <div className="relative group">
            <svg
              className="w-5 h-5 flex"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
              onClick={() => navigate("/wishlist")}
            >
              <path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
            </svg>

            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {wishlistCount}
              </span>
            )}
            {/* Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-12 
                  opacity-0 translate-y-1
                  group-hover:opacity-100 group-hover:-translate-y-1
                  transition-all duration-300 ease-out
                  pointer-events-none"
            >
              <div className="bg-black text-white text-xs px-3 py-2 rounded relative ">
                Wishlist
                {/* Arrow */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-1 
                       w-2 h-2 bg-black rotate-45"
                ></span>
              </div>
            </div>
          </div>
          {/* Cart Icon */}
          <div className="relative group">
            <svg
              className="w-5 h-5 flex"
              fill="currentColor"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              onClick={() => setIsCartOpen(true)}
            >
              <path d="M352 128C352 57.42 294.579 0 224 0 153.42 0 96 57.42 96 128H0v304c0 44.183 35.817 80 80 80h288c44.183 0 80-35.817 80-80V128h-96zM224 48c44.112 0 80 35.888 80 80H144c0-44.112 35.888-80 80-80zm176 384c0 17.645-14.355 32-32 32H80c-17.645 0-32-14.355-32-32V176h48v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h160v40c0 13.255 10.745 24 24 24s24-10.745 24-24v-40h48v256z"></path>
            </svg>
            {/* Tooltip */}
            <div
              className="absolute left-1/2 -translate-x-1/2 -bottom-12 
                  opacity-0 translate-y-1
                  group-hover:opacity-100 group-hover:-translate-y-1
                  transition-all duration-300 ease-out
                  pointer-events-none"
            >
              <div className="bg-black text-white text-xs px-3 py-2 rounded relative ">
                Cart
                {/* Arrow */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 -top-1 
                       w-2 h-2 bg-black rotate-45"
                ></span>
              </div>
            </div>
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-[#252525] h-13.75 flex">
        <div className="text-white flex items-center gap-4 max-w-287.5 h-full mx-10 ">
          {HeaderNavigation.map((data) => (
            <div
              key={data.id}
              className="relative group h-full flex items-center"
            >
              {/* Title */}
              <h1 className="relative cursor-pointer h-full flex items-center px-3">
                {/* TEXT + ICON */}
                <div className="flex items-center gap-1">
                  {/* TEXT WRAPPER (IMPORTANT) */}
                  <div className="relative inline-block">
                    <span className="relative z-10">{data.title}</span>

                    {/* UNDERLINE (TEXT BASED) */}
                    <span
                      className="
                  absolute
                  left-0
                  -bottom-1.5
                  h-0.5
                  w-[110%]
                  bg-[#F4F4F4]
                  transform
                  scale-x-0
                  origin-left
                  transition-transform
                  duration-300
                  group-hover:scale-x-100
                "
                    />
                  </div>

                  {/* ARROW */}
                  <span className=" transition-transform duration-300 group-hover:rotate-180">
                    <RiArrowDropDownLine />
                  </span>
                </div>
              </h1>

              {/* DROPDOWN */}
              {data.subHeading && (
                <div
                  className="
              absolute
              left-0
              top-13.75
              bg-white
              text-gray-500
              w-56
              shadow-lg
              z-50
              transform
              translate-y-2
              opacity-0
              pointer-events-none
              transition-all
              duration-500
              ease-out
              group-hover:translate-y-0
              group-hover:opacity-100
              group-hover:pointer-events-auto
            "
                >
                  {data.subHeading.map((sub) => (
                    <p
                      key={sub.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-black"
                      onClick={() => navigate(sub.link)}
                    >
                      {sub.title}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
}

export default Header;
