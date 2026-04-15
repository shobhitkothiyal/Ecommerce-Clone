import React from "react";
import {
  MdLocalShipping,
  MdCheckCircle,
  MdConfirmationNumber,
  MdInventory2,
  MdHome,
  MdCancel,
  MdAssignmentReturn,
} from "react-icons/md";

const OrderStatusStepper = ({ orderStatus, isCancelled, order }) => {
  const steps = [
    { label: "Placed", status: "PLACED", icon: MdConfirmationNumber },
    { label: "Confirmed", status: "CONFIRMED", icon: MdCheckCircle },
    { label: "Shipped", status: "SHIPPED", icon: MdInventory2 },
    {
      label: "Out For Delivery",
      status: "OUT_FOR_DELIVERY",
      icon: MdLocalShipping,
    },
    { label: "Delivered", status: "DELIVERED", icon: MdHome },
  ];

  if (
    orderStatus === "RETURN_REQUESTED" ||
    orderStatus === "RETURN_APPROVED" ||
    orderStatus === "RETURNED"
  ) {
    steps.push({
      label:
        order?.returnRequestType === "EXCHANGE"
          ? orderStatus === "RETURNED"
            ? "Exchange Received"
            : orderStatus === "RETURN_APPROVED"
              ? "Exchange Approved"
              : "Exchange Requested"
          : orderStatus === "RETURNED"
            ? "Returned"
            : orderStatus === "RETURN_APPROVED"
              ? "Return Approved"
              : "Return Requested",
      status: "RETURN_APPROVED",
      icon: MdAssignmentReturn,
    });
  }

  const getActiveStep = (status) => {
    switch (status) {
      case "PLACED":
        return 0;
      case "CONFIRMED":
        return 1;
      case "SHIPPED":
        return 2;
      case "OUT_FOR_DELIVERY":
      case "OUTFORDELIVERY":
        return 3;
      case "DELIVERED":
        return 4;
      case "RETURN_REQUESTED":
        return 4; // Not yet completed (colored)
      case "RETURNED":
      case "RETURN_APPROVED":
        return 5;
      case "CANCELLED":
        return -1;
      default:
        return 0;
    }
  };

  const activeStep = getActiveStep(orderStatus);

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg">
        <MdCancel size={20} />
        <span className="font-bold text-sm">Order Cancelled</span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-between w-full max-w-2xl">
      {/* Line Background */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 z-0 -translate-y-1/2" />

      {steps.map((step, index) => {
        const Icon = step.icon;
        const isCompleted = index <= activeStep;

        return (
          <div
            key={step.status}
            className="flex flex-col items-center gap-1 z-10 bg-white px-1"
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted
                  ? step.status === "RETURN_APPROVED"
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-green-500 border-green-500 text-white"
                  : "bg-white border-gray-300 text-gray-300"
              }`}
            >
              <Icon size={12} />
            </div>
            <p
              className={`text-[10px] font-bold hidden sm:block ${
                isCompleted
                  ? step.status === "RETURN_APPROVED"
                    ? "text-red-600"
                    : "text-black"
                  : "text-gray-400"
              }`}
            >
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default OrderStatusStepper;