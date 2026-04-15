import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const faqData = [
  {
    question:
      "I placed an order, however, I have not received any update regarding its shipping.",
    answer: (
      <>
        For all orders, you will receive{" "}
        <strong>order confirmation by e-mail and WhatsApp</strong>.
        Additionally, you will receive a <strong>shipping confirmation</strong>{" "}
        as soon as the product is dispatched from our facility.
        <br />
        In case your order is delayed you will be notified by WhatsApp - please
        feel free to reach out to our customer care in order for an update on
        the same. Rest assured, delays happen very rarely at Uptownie!
      </>
    ),
  },
  {
    question: "What are the shipping charges on uptownie.com?",
    answer: (
      <>
        There is a ₹20 Shipping Fee for all orders. For COD orders we charge an
        additional fee of ₹99. If you place a prepaid order, you can get ₹50 off
        on your order at checkout.
        <br />
        Products can be returned or exchanged within 7 days of delivery.
        <br />
        For international orders, we charge Rs. 1000 for shipping.
      </>
    ),
  },
  {
    question: "How long will it take to receive the ordered products?",
    answer:
      "We attempt to process and ship every order within 72 working hours. Your order will get delivered within 3-8 business days depending on your location in India. In some cases, it may take longer to receive the shipment depending on your accessibility.",
  },
  {
    question:
      "I don't live in India. Can I still get it shipped to my location?",
    answer: (
      <>
        Absolutely. <strong>Uptownie ships internationally!</strong> Be it the
        Indonesian archipelago or New York City, we're here to deliver. For
        international orders, we charge <strong>Rs. 1000</strong> for shipping.
      </>
    ),
  },
  {
    question:
      "I've already returned a product and got it exchanged for another. Can I return the exchanged product again?",
    answer: "No, we can only exchange or return a particular product once.",
  },
  {
    question:
      "What should be done if my package is opened or tampered with or if I receive an incorrect article?",
    answer:
      "If the shipment you have received has been tampered with or incorrect please contact us within 24 hours of receiving the shipment. Please send us an image of the tampered shipment so we can take further action.",
  },
  {
    question: "What delivery methods do you use?",
    answer:
      "We use leading courier companies such as Bluedart, Delhivery, Xpressbees, Ekart and many others for shipment in India.",
  },
  {
    question: "What is our return policy?",
    answer: (
      <>
        We love our products and are sure that you will love them too. However,
        if you wish to return any product, we'll be happy to take it back.
        <br />
        All products bought can be returned within <strong>7 days</strong> of
        delivery, for <strong>STORE CREDIT</strong> which can be used towards
        any future purchase with us for two years. Please note that products on
        our Pink Friday Sale are final sale and not eligible for return.
        <br />
        Products to be returned should be unused and in the same condition as
        you received them, in their original packaging with all tags.
        <br />
        All returns will be accepted against the original order only once.{" "}
        <strong>Return will not be accepted for any previous exchanges.</strong>
        <br />
        Shipping charges cannot be refunded.
      </>
    ),
  },
  {
    question: "How do I return products to Uptownie?",
    answer: (
      <>
        You can follow the steps below to <strong>place a return</strong> for
        your product:
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>
            On our website www.uptownie.com, click on My profile (top right
            corner) and <strong>Log in</strong> with your email and password.
          </li>
          <li>
            If you don't have an Uptownie account, click on{" "}
            <strong>Register</strong> and register with the email ID you used
            while making your order. You will get a Confirmation email. You can
            click on ‘Visit our Store’ there.
          </li>
          <li>
            Now you can go to My profile (top right corner) and Log in with your
            email and password.
          </li>
          <li>
            Scroll down to and click on <strong>‘My Returns’</strong> under
            Company.
          </li>
          <li>
            Enter your <strong>Order ID</strong> and Email ID, select each of
            the products you want to return, and confirm.
          </li>
        </ol>
        <p className="mt-2">
          The product will be picked up from your address{" "}
          <strong>within 2-3 business days</strong>. Please pack the merchandise{" "}
          <strong>with the invoice and the tags</strong> intact.
        </p>
        <p className="mt-2">
          You will receive your store credits within 5 business days of the
          return being picked up. You can use these credits to make your next
          purchase. Your store credits will be valid for 2 years.
        </p>
      </>
    ),
  },
  {
    question: "How do I use my Store Credits?",
    answer: (
      <ol className="list-decimal pl-5 space-y-2">
        <li>
          On our website www.uptownie.com, click on My profile (top right
          corner) and <strong>Log in</strong> with your email and password.
        </li>
        <li>
          You can view the value of your store credits on clicking{" "}
          <strong>'Show my Credits'</strong>
        </li>
        <li>
          Enter your email ID and{" "}
          <strong>
            generate a discount code for an amount equal to or less than your
            cart value.
          </strong>
        </li>
        <li>Copy the discount code generated, and use this as checkout!</li>
      </ol>
    ),
  },
  {
    question: "What is our exchange policy?",
    answer: (
      <>
        Have you ordered a size too small or too big? No problem.
        <br />
        Click on ‘How do I return products to Uptownie?’ and follow the process
        outlined. You can later <strong>use your store credits</strong> to place
        a new order for any product you like!
      </>
    ),
  },
  {
    question: "Can I cancel my order?",
    answer: (
      <>
        After placing an order on Uptownie, if you wish to cancel the order,
        please email us at customerservice@uptownie101.com or click on the
        WhatsApp icon at the bottom-right of this screen and drop us a text with
        the order details. As long as your order has not been sent for
        processing, we can cancel it and refund your amount. Once the order has
        been sent for processing, it cannot be canceled.
      </>
    ),
  },
];

const ShippingAndReturns = () => {
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
          Shipping & Returns
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span>&gt;</span>
          <span>Shipping & Returns</span>
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
                  ? "max-h-[800px] opacity-100 mb-4"
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

export default ShippingAndReturns;