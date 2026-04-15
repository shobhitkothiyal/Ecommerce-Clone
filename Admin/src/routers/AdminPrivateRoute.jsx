import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const AdminPrivateRoute = ({ children }) => {
  const { jwt } = useSelector((store) => store.auth);
  const location = useLocation();

  const isTokenExpired = (token) => {
    if (!token) return true;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      const { exp } = JSON.parse(jsonPayload);
      const currentTime = Date.now() / 1000;
      return exp < currentTime;
    } catch (e) {
      return true;
    }
  };

  const token = jwt || localStorage.getItem("jwt");

  if (!token || isTokenExpired(token)) {
    // Determine if we need to clear storage or just redirect
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("jwt");
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminPrivateRoute;