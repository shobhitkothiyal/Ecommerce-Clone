import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question: "What are the payment options available on uptownie.com?",
    answer: (
      <>
        You can choose from the following payment options:
        <br />
        Credit card and Debit card
        <br />
        Net Banking
        <br />
        Cash on Delivery
      </>
    ),
  },
  {
    question: "Is it safe to use my credit/debit card on uptownie.com?",
    answer:
      "You can be assured that Uptownie offers you the highest standards of security currently available to ensure that your shopping experience is private, safe and secure. Your bank will authorize the credit card transaction directly without any information passing through us – we do not retain your banking information.",
  },
  {
    question:
      "What if I make a purchase using my credit/debit card, and the amount gets charged to my card but the order is not successfully placed?",
    answer: (
      <>
        This is not likely to happen, but in case it does, please contact
        customer service at{" "}
        <a
          href="mailto:customerservice@uptownie101.com"
          className="underline text-blue-600 hover:text-blue-800"
        >
          customerservice@uptownie101.com
        </a>
        , and we will refund your money within 5 working days.
      </>
    ),
  },
  {
    question: "What is the process for Cash On Delivery (COD) purchase?",
    answer:
      "Please note that COD option is available at a cost Rs. 99 per order. You'll get your order delivered in 4-6 business days.",
  },
  {
    question: "Is there a charge if I opt for COD?",
    answer:
      "COD is available at a charge of Rs.99 for all orders. In case you want to place a prepaid order, shipping is free!",
  },
  {
    question: "Is there a purchase limit for a COD purchase?",
    answer:
      "Yes, COD option is available on purchases up to a limit of Rs. 10,000, beyond which purchases can only be made using Netbanking or Creditcard/Debitcard.",
  },
  {
    question: "How do I pay the courier person for COD purchase?",
    answer:
      "Please pay the courier person in cash only. We do not accept cheque or DD.",
  },
  {
    question: "Can I cancel my COD order when it reaches me?",
    answer:
      "Once an order has been processed, it cannot be cancelled. Please accept the shipment when you get it as the courier person will not take the product back. In case you wish to return the product, follow the process outlined in the return policy. Please note that failure to accept the shipment will lead to cancellation of COD facility on your account for all future orders.",
  },
];

const PaymentsAndOrders = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
          Payments & Orders
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span>&gt;</span>
          <span>Payments & Orders</span>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqData.map((item, index) => (
          <div key={index} className="border-b border-gray-200">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex justify-between items-center py-4 text-left focus:outline-none group"
            >
              <span
                className={`text-base md:text-lg font-medium transition-colors ${
                  openIndex === index ? "text-black" : "text-gray-800"
                }`}
              >
                {item.question}
              </span>
              <span className="text-gray-400 ml-4">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-96 opacity-100 mb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentsAndOrders;