import React, { useState, useEffect } from "react";
import { FaBox, FaChevronDown, FaChevronUp } from "react-icons/fa";

const MyReturns = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How will I send the items back?",
      answer:
        "We will arrange the pickup, just keep the products packed with tags intact. Your item will be picked up from your address within 24 - 48 hours after placing the return.",
    },
    {
      question: "When will I receive my refund?",
      answer:
        "You will receive your store credits within 5 business days of the return being picked up.",
    },
    {
      question: "Can I track my return?",
      answer:
        "Yes, you can track the return. You will receive the tracking link in your mail id.",
    },
    {
      question: "Do you have cash refund policy?",
      answer:
        "We provide store credits for returns, and not cash refunds. Shipping charges are non-refundable. Store credits can be combined with website offers at the time of checkout.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 animate-fade-in font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-normal mb-2 text-gray-900">My Returns</h1>
        <p className="text-gray-500 text-sm">
          Easy returns, hassle-free experience
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center items-center mb-16 space-x-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md">
            1
          </div>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center font-medium">
            2
          </div>
        </div>
        <div className="w-16 h-px bg-gray-300"></div>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-gray-400 flex items-center justify-center font-medium">
            3
          </div>
        </div>
      </div>

      {/* Identify Order Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Identify Your Order
        </h2>
        <p className="text-gray-500 text-sm">
          Enter your order details to get started -
        </p>
      </div>

      {/* Order Lookup Card */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm max-w-2xl mx-auto mb-20 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center space-x-2">
          <FaBox className="text-amber-700" />
          <span className="font-semibold text-gray-800 text-sm">
            Order Information
          </span>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Order Number
            </label>
            <input
              type="text"
              placeholder="e.g. 548714"
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter the email ID that was used to place the order"
              className="w-full px-4 py-3 border border-gray-200 rounded text-sm focus:outline-none focus:border-gray-400 bg-gray-50"
            />
          </div>
          <button className="w-full bg-black text-white py-3 rounded font-medium text-sm hover:bg-gray-800 transition-colors">
            Find My Order
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-bold text-gray-900 mb-6">
          Frequently Asked Questions
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="w-full flex justify-between items-center text-left focus:outline-none py-2"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-gray-800 font-medium text-sm md:text-base">
                  {faq.question}
                </span>
                {openFaq === index ? (
                  <FaChevronUp className="text-gray-500 text-xs" />
                ) : (
                  <FaChevronDown className="text-gray-500 text-xs" />
                )}
              </button>
              {openFaq === index && (
                <div className="mt-2 text-gray-500 text-sm leading-relaxed animate-fade-in">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReturns;