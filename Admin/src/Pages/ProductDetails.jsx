import React from "react";
import AddProductForm from "../Components/AddProductForm.jsx";

const ProductDetails = () => {
  return (
    <div>
      <AddProductForm readOnly={true} />
    </div>
  );
};

export default ProductDetails;