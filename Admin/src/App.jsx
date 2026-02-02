import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./Pages/Dashboard";
import Products from "./Pages/Products";
import Customers from "./Pages/Customers";
import Blogs from "./Pages/Blogs";
import AdminAddProduct from "./Pages/AdminAddProduct";
import OrdersTable from "./Orders/OrdersTable";
import Coupan from "./Coupons/Coupan";
import Queries from "./Pages/Queries";
import ProductDetails from "./Pages/ProductDetails";

import AdminLogin from "./Pages/AdminLogin";
import AdminPrivateRoute from "./routers/AdminPrivateRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        element={
          <AdminPrivateRoute>
            <AdminLayout />
          </AdminPrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/update-product" element={<AdminAddProduct readOnly={true} />} />
        <Route path="orders" element={<OrdersTable />} />
        <Route path="create-coupon" element={<Coupan />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
      </Route>
    </Routes>
  );
};

export default App;