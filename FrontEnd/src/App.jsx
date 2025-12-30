import React from "react";
import { Router,Routes, Route } from "react-router-dom";
import Footer from "./Common/Footer.jsx";
import Header from "./Common/Header.jsx";
import Home from "./Home.jsx";
import Product from "./Product/Product.jsx";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element = { <Product /> } />
        <Route path="/:levelOne/:levelTwo/:LevelThree" element = { <Product /> } />
        <Route path="/:levelOne/:levelTwo" element = { <Product /> } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;