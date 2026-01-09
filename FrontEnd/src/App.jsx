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
import PrivacyPolicy from "./PrivacyAndPolicy/PrivacyAndPolicy";
import CampusAmbassador from "./CampusAmbassador/CampusAmbassador";
import SizeChart from "./SizeChart/SizeChart";
import ScrollToTop from "../ScrollToTop";
import QuickViewModal from "./Product/QuickViewModal";

function App() {
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
      </Routes>

      <Footer />
    </CartProvider>
  );
}

export default App;