import React from "react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingButtons() {
  return (
    <>
      {/* Left Button */}
      <button
        className="
          fixed bottom-5 left-5
          z-999
          bg-black text-white
          px-4 py-3 rounded-full
          shadow-lg
          hover:scale-105
          transition
        "
      >
        DOWNLOAD APP
      </button>

      {/* Right Button */}
      <button
        className="
          fixed bottom-5 right-5
          z-999
          bg-white
         text-[#25D366]
          text-[50px]
          rounded-full
          shadow-lg
          hover:scale-105
          transition
        "
      >
        <FaWhatsapp />
      </button>
    </>
  );
}