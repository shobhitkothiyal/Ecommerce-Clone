import React from "react";
import { Link } from "react-router-dom";
import footerNavigations from "../Navigation/footerNavigation.js";
import {
  FaPinterest,
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <div className="w-full bg-[#E8E8E8] p-12">
      <div className="grid grid-cols-4 gap-4">
        {footerNavigations.map((data) => (
          <div key={data.id} className="flex flex-col">
            <h1 className="font-medium">{data.title}</h1>
            <br />
            <ul className="h-full space-y-2">
              {data.subHeading.map((subData) => (
 <li
  key={subData.id}
  className="text-gray-400 hover:text-black cursor-pointer group w-fit"
>
  <Link to={subData.link} className="inline-block">
    <span className="relative inline-block">
      {subData.title}
      <span
        className="
          absolute left-0 -bottom-1
          h-[1px] w-full bg-black
          scale-x-0 origin-left
          transition-transform duration-400 ease-out
          group-hover:scale-x-100
        "
      />
    </span>
  </Link>
</li>

              ))}
            </ul>
          </div>
        ))}

        {/* Get in Touch */}
        <div className="flex flex-col">
          <h1 className="font-medium">Get in touch</h1>
          <br />
          <ul className="space-y-2">
            <li className="text-gray-400 hover:text-black duration-400 cursor-pointer w-fit">
              <Link to="#">080 6863 5857</Link>
            </li>
            <li className="text-gray-400 hover:text-black duration-400 cursor-pointer w-fit">
              <Link to="/contact">
                customerservice@uptownie101.com
              </Link>
            </li>
          </ul>

          <div className="flex gap-4 mt-4 text-gray-500 text-xl">
            <Link to="/pinterest">
              <FaPinterest className="hover:text-black" />
            </Link>
            <Link to="/facebook">
              <FaFacebook className="hover:text-black" />
            </Link>
            <Link to="/instagram">
              <FaInstagram className="hover:text-black" />
            </Link>
            <Link to="/snapchat">
              <FaSnapchat className="hover:text-black" />
            </Link>
            <Link to="/youtube">
              <FaYoutube className="hover:text-black" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
