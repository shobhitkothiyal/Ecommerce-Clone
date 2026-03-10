import React from "react";
import { Router, Routes, Route } from "react-router-dom";
import Footer from "./Common/Footer";
import Headers from "./Common/Header"; // Make sure this file exists
import Home from "./Home";
import Product from "./Product/Product";
import ProductDetails from "./Product/ProductDetails";
import Wishlist from "./Wishlist/Wishlist";
import { CartProvider } from "./Context/CartContext";
import CartDrawer from "./Cart/CartDrawer";
import FloatingButtons from "../Global/FloatingButtons";
import ContactUs from "./ContactUs/ContactUs";
import TermsAndConditions from "./TermsAndConditions/TermsAndConditions";
import PaymentsAndOrders from "./PaymentsAndOrders/PaymentsAndOrders";
import ShippingAndReturns from "./ShippingAndReturns/ShippingAndReturns";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import CampusAmbassador from "./CampusAmbassador/CampusAmbassador";
import SizeChart from "./SizeChart/SizeChart";
import AboutUs from "./AboutUs/AboutUs";
import MyReturns from "./MyReturns/MyReturns";
import Blog from "./Blog/Blog";
import BlogDetails from "./Blog/BlogDetails";
import ScrollTOTop from "./ScrollToTop.jsx";;
import Careers from "./Careers/Careers";
import OrderHistory from "./OrderHistory/OrderHistory";
import OrderDetails from "./OrderHistory/OrderDetails";
import Addresses from "./OrderHistory/Addresses";
import Login from "./Pages/Login";
import OrderSuccess from "./Order/OrderSuccess";

import { useDispatch, useSelector } from "react-redux"; // Import hooks
import { useEffect } from "react";
import { getUser } from "./Redux/Auth/actions.js";
import { getCart } from "./Redux/Customers/Cart/Action.js";

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    if (token) {
      dispatch(getUser(token));
      dispatch(getCart());
    }
  }, [dispatch, token]);

  return (
    <CartProvider>
      <FloatingButtons />
      <Headers />
      <CartDrawer />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pdt/:levelOne" element={<Product />} />
        <Route path="/pdt/:levelOne/:levelTwo" element={<Product />} />
        <Route
          path="/pdt/:levelOne/:levelTwo/:LevelThree"
          element={<Product />}
        />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/payment-orders" element={<PaymentsAndOrders />} />
        <Route path="/shipping-returns" element={<ShippingAndReturns />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cap" element={<CampusAmbassador />} />
        <Route path="/size-chart" element={<SizeChart />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/return" element={<MyReturns />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/account/order/:orderId" element={<OrderDetails />} />
        <Route path="/order-success/:orderId" element={<OrderSuccess />} />
        <Route path="/account/addresses" element={<Addresses />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </CartProvider>
  );
}

export default App;