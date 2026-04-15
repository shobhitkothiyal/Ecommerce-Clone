import React from "react";
import Header from "./Common/Header.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

import { Autoplay, Pagination } from "swiper/modules";
import { HeroSectionSwiper } from "./HomeData/HeroSectionImg.js";
import homeCollectionData from "./HomeData/homeCollectionData.js";
import HomeOptionsData from "./HomeData/HomeOptionsData.js";
import { getTheLookData } from "./HomeData/getTheLookData.js";

function Home() {
  const Navigate = useNavigate();
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className}">
            <svg class="autoplay-progress" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20"></circle>
            </svg>
          </span>`;
          },
        }}
        navigation={true}
        modules={[Autoplay, Pagination]}
        className="w-full h-300"
      >
        {HeroSectionSwiper.map((data) => (
          <SwiperSlide key={data.id} className="relative">
            <img
              src={data.img}
              alt={data.title}
              className="w-full h-300 object-cover "
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="grid grid-cols-4 gap-1 cursor-pointer">
        {homeCollectionData.map((data) => (
          <div key={data.id} className="rounded-xl overflow-hidden group">
            <img
              src={data.img}
              alt={data.title}
              onClick={() => Navigate(data.link)}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center">
        <p className="text-xl font-bold p-5 uppercase">
          You always need options
        </p>

        <div className="grid grid-cols-4 gap-6 cursor-pointer">
          {HomeOptionsData.map((data) => (
            <div
              key={data.id}
              onClick={() => Navigate(data.link)}
              className="rounded-xl overflow-hidden group"
            >
              <div className="overflow-hidden rounded-xl">
                <img
                  src={data.img}
                  alt={data.title}
                  className="w-full h-112.5 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>

              <p className="text-center font-bold text-[14px] mt-2">
                {data.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center justify-center bg-[#F9F6F9] h-142.5 mt-4">
        <p className="text-xl font-bold p-5 uppercase">Get the look</p>

        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="h-112.5 w-full"
        >
          {getTheLookData.map((data) => (
            <SwiperSlide
              key={data.id}
              onClick={() => Navigate(data.link)}
              className="relative cursor-pointer group"
            >
              {/* Image wrapper */}
              <div className="overflow-hidden rounded-xl">
                <img
                  src={data.img}
                  alt=""
                  className="w-full h-112.5 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </div>

              {/* Button */}
              <p className="absolute -bottom-px left-0 w-full text-center font-bold text-[14px] uppercase bg-white p-2">
                Shop Now
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}

export default Home;
