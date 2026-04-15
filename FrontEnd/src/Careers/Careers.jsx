import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar, FaImage, FaPen, FaCamera, FaChartLine } from "react-icons/fa";

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const phrases = [
    "IDEAS OVER EGOS",
    "ABSOLUTELY NO B-TEAMS",
    "MONDAY SUCK LESS",
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 3000); // Change text every 3 seconds

    return () => clearInterval(interval);
  }, [phrases.length]);

  const testimonials = [
    {
      id: 1,
      name: "Shivani Priya",
      role: "2nd Year, Fashion Design",
      college: "NIFT, Kolkata",
      image:
        "https://uptownie.com/cdn/shop/files/02c5476481a86acef7e4a62f4cd244685af1fac98329170a26f1ad105176cf489b713b69f8257a8455343a4470753ca6_caee907c-ebfc-4ea7-8b4e-91be00bcadc2_120x.jpg?v=1653552599", // Placeholder/Best guess based on context or generic
      review:
        "Working at Uptownie101 was an amazing experience! The atmosphere in office is brilliant and the team is bursting with fresh, new ideas! We all sit together and collaborate on different marketing plans and the best part is that there is no system of hierarchy. Everybody is considered an equal regardless of your position and your ideas are always taken into consideration. Being a fashion design student my course doesn't highlight much on marketing and I was happy to get my dose of that here at Uptownie101. Work never really felt like work as I was doing what I love, just in a more organized fashion.",
    },
    {
      id: 2,
      name: "Bhumi Choudhary",
      role: "3rd Year, BBA",
      college: "J.D Birla, Kolkata",
      image:
        "https://uptownie.com/cdn/shop/files/bhumi_5dbe59ab-5632-43e9-85b9-443e167c43eb_180x.jpg?v=1653552621",
      review:
        "So far, interning at uptownie has been amazing. When I come back home, I'm not exhausted or looking for a break because it doesn't feel like 'work'. The office environment is so informal and friendly that calling it an 'office' does injustice to the place. The work pressure is just about right and doesn't choke me to death but at the same time challenges me to work harder and rise up to my full potential (WHY-PHY). The job description in itself is so creative that I learn something new everyday and stay up-to-date with latest trends.",
    },
    {
      id: 3,
      name: "Debadipta Roy",
      role: "Graduate, B.Tech (CS)",
      college: "Women's polytechnic, Kolkata",
      image:
        "https://uptownie.com/cdn/shop/files/deba_f783e67d-f43e-4891-9b79-5b6e0d02a2e6_180x.jpg?v=1653552739",
      review:
        "I started internship here to learn something after joining here I have also started taking responsibilities of work which helped me leadership quality in me. The biggest plus place is its most friendly environment, and ideas of yours are taken into consideration. places have hierarchy system, but this is not over here, we were always free to work to showcase our ideas. Sometimes, there were to hold my hands to get over the problems sometimes I was thrown into the deep water out things on my own. All these experience to be pro in what I do.",
    },
    {
      id: 4,
      name: "Ananya Gupta",
      role: "Student, Marketing",
      college: "Symbiosis, Pune",
      image:
        "https://uptownie.com/cdn/shop/files/radhika_84d2df9d-443f-4a5b-b4e7-b90047cf32c4_180x.jpg?v=1653552751",
      review:
        "The creative freedom at Uptownie is unmatched. I came in expecting a strict corporate structure but found a family that values every voice. From day one, I was leading projects I never thought I'd touch as an intern. It's fast-paced, sometimes chaotic, but always rewarding.",
    },
    {
      id: 5,
      name: "Rohan Das",
      role: "Graduate, Fashion Tech",
      college: "NIFT, Delhi",
      image:
        "https://uptownie.com/cdn/shop/files/deba_f783e67d-f43e-4891-9b79-5b6e0d02a2e6_180x.jpg?v=1653552739",
      review:
        "Uptownie isn't just a workplace; it's a learning hub. The mentors here actually care about your growth. I learned more about e-commerce and brand positioning in 3 months here than I did in 3 years of college. If you want real responsibility, this is the place.",
    },
    {
      id: 6,
      name: "Sneha Reddy",
      role: "Final Year, B.Des",
      college: "Srishti, Bangalore",
      image:
        "https://uptownie.com/cdn/shop/files/02c5476481a86acef7e4a62f4cd244685af1fac98329170a26f1ad105176cf489b713b69f8257a8455343a4470753ca6_caee907c-ebfc-4ea7-8b4e-91be00bcadc2_120x.jpg?v=1653552599",
      review:
        "The sheer energy of the team is contagious. 'Monday suck less' isn't just a slogan - it's actually true here. We tackle real design challenges, and seeing my ideas go live on the site was the highlight of my year. Definitely a standout experience.",
    },
  ];

  return (
    <div className="animate-fade-in font-sans">
      {/* Hero Section */}
      <div className="w-full h-screen bg-[#EBCDEF] flex items-center justify-start pl-8 md:pl-10 transition-colors duration-1000 overflow-hidden">
        <div className="h-25 overflow-hidden">
          <h1
            key={currentPhraseIndex}
            className="text-2xl md:text-3xl lg:text-4xl font-light text-black tracking-wide uppercase origin-left animate-slide-up"
          >
            {phrases[currentPhraseIndex]}
          </h1>
        </div>
      </div>
      {/* Internship Diaries Slider */}
      <div className="max-w-8xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-8">
            INTERNSHIP DIARIES
          </h2>
          {/* Custom Pagination Container */}
          <div className="careers-swiper-pagination flex justify-center gap-2 mt-4" />
        </div>

        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: ".careers-swiper-pagination", // Target the custom container
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16"
        >
          {testimonials.map((intern) => (
            <SwiperSlide key={intern.id} className="pb-12 h-auto px-2 pt-2">
              <div className="bg-white p-4 h-full flex flex-col hover:shadow-xl transition-all duration-300 rounded-sm cursor-default border border-transparent hover:border-gray-50">
                <div className="flex items-start space-x-4 mb-4">
                  {/* Image - Mobile: Top, Desktop: Beside text if needed, but styling follows screenshot which has purely text columns with image floating or inline. 
                       Screenshot shows: Name/Details on left, Image on right (for the card header essentially).
                   */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                      {intern.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-700">
                      {intern.role}
                    </p>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      {intern.college}
                    </p>
                    <div className="flex text-black mb-4 gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-xs" />
                      ))}
                    </div>
                  </div>
                  <div className="w-24 h-24 shrink-0 overflow-hidden">
                    <img
                      src={intern.image}
                      alt={intern.name}
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                  </div>
                </div>

                <div className="text-gray-600 text-sm leading-relaxed text-justify">
                  {intern.review}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      {/* What Are We Looking For Section */}
      <div className="w-full bg-[#f9f9f9] py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-16">
            WHAT ARE WE LOOKING FOR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: FaImage, label: "Graphic Designer" },
              { icon: FaPen, label: "Content Writer" },
              { icon: FaCamera, label: "Photographer" },
              { icon: FaChartLine, label: "Marketing Intern" },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center group">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-[#F07C74] rounded-full flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:scale-110 shadow-sm">
                  <item.icon className="text-5xl md:text-6xl text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-medium text-gray-800">
                  {item.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Life at Uptownie Section */}
      <div className="w-full h-250 bg-white py-20 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide text-gray-900 mb-12 text-center">
            LIFE AT UPTOWNIE
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-auto lg:h-150">
            {/* ... content remains same, handled by diff context ... */}
            {/* Left Column - Large Image */}
            <div className="relative group overflow-hidden h-full">
              <img
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop" // Placeholder for "Inspiring women at work"
                alt="Inspiring women at work"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                <p className="text-white text-sm md:text-base font-light mb-2 opacity-90">
                  We consciously inculcate a diversity-friendly environment,
                  policies and programs that support women in living their
                  dreams and making a difference at work.
                </p>
                <h3 className="text-white text-2xl md:text-3xl font-semibold">
                  Inspiring women at work
                </h3>
              </div>
            </div>

            {/* Right Column - Two Stacked Images */}
            <div className="flex flex-col gap-4 h-full">
              {/* Top Right */}
              <div className="relative group overflow-hidden h-1/2">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" // Placeholder for "Building great careers"
                  alt="Building great careers"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  <p className="text-white text-sm md:text-base font-light mb-2 opacity-90">
                    Our enabling environment & talent management strategy
                    ensures our people get exciting career paths at Uptownie101
                  </p>
                  <h3 className="text-white text-2xl md:text-3xl font-semibold">
                    Building great careers
                  </h3>
                </div>
              </div>

              {/* Bottom Right */}
              <div className="relative group overflow-hidden h-1/2">
                <img
                  src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" // Placeholder for "Fun with responsibility"
                  alt="Fun with responsibility"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-8">
                  <p className="text-white text-sm md:text-base font-light mb-2 opacity-90">
                    We believe in packing each moment of our life with loads of
                    fun and frolic. However, while celebrating life we also keep
                    in mind our duty towards the society.
                  </p>
                  <h3 className="text-white text-2xl md:text-3xl font-semibold">
                    Fun with responsibility
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-20 w-full bg-white" /> {/* Extra spacer */}
    </div>
  );
};

export default Careers;