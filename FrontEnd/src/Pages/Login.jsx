import React, { useState } from "react";
import AuthModal from "../Components/AuthModal/AuthModal";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setOpen(false);
    navigate("/"); // Redirect to home on close
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <AuthModal isOpen={open} onClose={handleClose} />
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
        <p className="text-gray-600 mb-4">Please login to continue.</p>
        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-6 py-2 rounded"
        >
          Open Login
        </button>
      </div>
    </div>
  );
};

export default Login;