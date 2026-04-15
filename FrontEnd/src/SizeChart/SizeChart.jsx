import React, { useEffect } from "react";

const SizeChart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 font-serif">
          Size Chart
        </h1>
        <div className="text-gray-600 space-y-2 text-sm md:text-base uppercase tracking-wide">
          <p>PLEASE USE THE CHART BELOW TO DECIDE WHICH SIZE TO ORDER</p>
          <p className="normal-case text-gray-500 text-xs md:text-sm">
            If you would like more specific information on the sizing on a
            particular garment, please contact Customer Care with your
            questions.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
        {/* Left Side: How to measure */}
        <div className="text-center md:text-right space-y-8 flex-1">
          <h2 className="text-3xl md:text-4xl font-light mb-8">
            How to measure yourself
          </h2>

          <div className="space-y-2">
            <h3 className="text-gray-500 uppercase tracking-widest text-sm">
              Bust
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              For an accurate measurement, measure your chest over the fullest
              part of your bust.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500 uppercase tracking-widest text-sm">
              Waist
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Measure around the narrowest point of your waist.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-gray-500 uppercase tracking-widest text-sm">
              Hips
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Measure at the fullest part of your hips while standing with your
              heels together.
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1">
          <img
            src="https://uptownie.com/cdn/shop/files/SIZE-final-black-copy1_a81c665b-dd23-46f2-9514-71d36cbd81e1_700x.jpg?v=1653547081"
            alt="Size Chart Diagram"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default SizeChart;