import React, { useState } from "react";
import { Link } from "react-router-dom";
import { footerNavigations} from "../Navigation/footerNavigations.js";

import {
  FaPinterest,
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  const [toggle, setToggle] = useState(false);
  const popular = [
    { id: 1, title: "Women Tops", link: "/pdt/women-tops" },
    { id: 2, title: "Women Dresses", link: "/pdt/women-dresses" },
    { id: 3, title: "Women Skirts", link: "/pdt/women-skirts" },
    { id: 4, title: "Women Bottoms Pants", link: "/pdt/women-bottoms-pants" },
    { id: 5, title: "Women Jumpsuits", link: "/pdt/women-jumpsuits" },
    { id: 6, title: "Women Tunics", link: "/pdt/women-tunics" },
    { id: 7, title: "Women T-Shirts", link: "/pdt/women-t-shirts" },
  ];
  return (
    <div className="w-full bg-[#E8E8E8] p-15">

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
          h-px w-full bg-black
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
              <Link to="/contact">customerservice@uptownie101.com</Link>
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
      <div
        onClick={() => setToggle(!toggle)}
        className="flex justify-between gap-10 bg-white p-4 mt-20 transition-all duration-300 hover:bg-gray-300"
      >
        <div className="">Uptownie</div>
        {toggle ? (
          <div className="cursor-pointer">-</div>
        ) : (
          <div className="cursor-pointer">+</div>
        )}
      </div>
      {toggle && (
        <div className="p-4  ">
          <p className="text-[18px]">Our Founder: Of Leadership and Strength</p>
          <p className="text-[13px]">
            Priyanka Agarwal is an entrepreneur and a fashion enthusiast with a
            keen eye for aesthetics, detail, and design. Uptownie was born out
            of her desire to empower Indian women with affordable and fuss-free
            clothing that complements their body type and physicality.
          </p>
          <p className="text-[13px] mt-4">
            Priyanka graduated from Duke University with a Bachelor of Science
            (BSc) in Economics and Math, and a specialization in Marketing and
            Visual Arts. Her work at Uptownie is a blend of fortes gathered
            through her years as a student. She also draws upon 40 years of her
            family’s experience within the fields of manufacturing and exports,
            to bring perfection to the production process.
          </p>
          <p className="text-[13px] mt-4">
            After 8 years of extensive experience working in the fashion
            industry, and churning out over 10,000 unique designs, Priyanka
            knows how a masterful play with colours, cuts, textures, patterns,
            and styles can bring out individuality and confidence in a woman.
            She endeavours to challenge beauty stereotypes and invites women
            from all over the country to join in an unabashed celebration of
            their own bodies. She steers away from designing for the ramp, and
            uses her clothes as a medium to communicate with the women of today
            and give them a chance to express their best selves.
          </p>
          <p className="text-[18px] mt-4">Our Team: Of Fashion and Passion</p>
          <p className="text-[13px] ">
            The driving force of the company is a team of young and urban Indian
            women who wear the shoes of our customers in every step of their
            way. We design fuss-free and chic clothes, keeping in mind that no
            one has the time for endless ironing, slips, nips and tucks,
            shoulders that slip off, or unflattering cuts.
          </p>
          <p className="text-[13px] mt-4">
            Our digital store is run by 50 young men and women who work across
            all departments: from marketing and designing, to warehousing, with
            a gusto for growth. The Uptownie office is a space of equal
            opportunity and a conducive environment for tremendous growth in the
            field of fashion.
          </p>
          <p className="text-[13px] mt-4">
            We envision a world where every body shape and size is celebrated.
            Your outfit is never “too bold” or “too well-fitted” or “too
            casual,” it is always a personal expression of your inner beauty.
            Scrolling through our store is never a hunt for what’s good, but
            always a tough pick between many great choices.
          </p>
          <p className="text-[18px] mt-4">
            Our Story: Of Perseverance and Growth
          </p>
          <p className="text-[13px] ">
            Uptownie is a homegrown womenswear brand with its roots in Kolkata,
            India. We design and manufacture clothes for Indian women, keeping
            in mind their preferences and sensibilities. We prioritize customer
            feedback and use it to optimize the fit, fabric, and look of our
            designs. By paying keen attention to small details we make a big
            difference in our process of stitching beautiful end products. Our
            mission as an online contemporary fashion label is to empower Indian
            women with the liberty to dress comfortably, fashionably and
            authentically.
          </p>
          <p className="text-[13px] mt-4">
            Since the birth of Uptownie in 2015, we have connected with over 10
            lakh customers. Today, our products have a nationwide presence and
            can be found on our website - www.uptownie.com as well as e-commerce
            stores such as Myntra, Jabong, Flipkart, Amazon, Nykaa Fashion, and
            Ajio. We are a one stop destination for the trendiest tops, dresses,
            skirts, jackets, pants, denims, jumpsuits and accessories.
          </p>
          <p className="text-[18px] mt-4">
            Our Process: Of Simplicity and Sustainability
          </p>
          <p className="text-[13px] ">
            We adopt global micro trends and design apparel, accessories, and
            footwear that align with the preferences of Indian women bearing in
            mind their height, weight, complexion, figure, and body type. An
            Uptownie outfit is hands down the most fuss-free and frequently worn
            clothing in any wardrobe.
          </p>
          <p className="text-[13px] mt-4">
            Our quality is our strength. Our factory, in Ganganagar, West
            Bengal, runs on the simple principle of producing clothes that are
            durable, affordable, and fashionable. To keep up with the
            fast-moving trends, we update our online catalogues weekly and
            refresh them with a range of styles for every occasion. More
            importantly, each piece upholds the promise of quality, comfort, and
            durability. Our work is certified by SGS - the world’s largest
            quality testing agency.
          </p>
          <p className="text-[18px] mt-4">Online Shopping for Women in India</p>
          <p className="text-[13px] ">
            Shopping is no longer an exhausting affair with women online
            shopping sites offering the accessibility of fuss-free shopping
            services, anytime and anywhere. With a larger than life repertoire
            to choose from, online shopping sites for women have made everyone’s
            life much easier and convenient. In this fast-paced world, Online
            Shopping is a boon. Be it branded or designer outfits, online
            shopping caters you the best of both. With services like cash on
            delivery, easy return, exchange & refund, these online stores are a
            fantastic platform that can create the best shopping experiences for
            people across the globe. Apart from providing the trendiest apparels
            and accessories, these online sites offer products at affordable
            prices without compromising on the quality of the item. Furthermore,
            services are available round the clock, no matter what time or day
            it is.
          </p>
          <p className="text-[18px] mt-4">UPTOWNIE: One-Stop Fashion Shop</p>
          <p className="text-[13px]">
            Who doesn’t want to stay trendy? Everyone does. Synonymous with
            trendy and fun, Uptownie is an exclusive fashion online shopping
            store for women who are bold and love quirky and unconventional
            styling. Featuring every season’s most trending outfits and
            much-in-fame accessories in the realm of fashion, Uptownie is the
            best online store for people who love to own clothes that are , hot,
            cool and fashionable. Tops, Dresses, Skirts, Pants or Denims to name
            a few, Uptownie has everything to offer, under one single roof.
            Uptownie is all about redefining fashion in the chicest way. There
            is something fun and dramatic for every fashion aficionado out
            there. To make shopping easy and convenient, Uptownie provides
            various facilities through online payment, Door Step Delivery and
            Cash on Delivery. In case you do not like the purchased product or
            have any kind of size issues, you can easily avail our Return,
            Refund and Exchange facility. Customer satisfaction is our utmost
            priority. And to ensure that all the queries and issues are resolved
            at the earliest, we have a customer care team to assist our esteemed
            customers.
          </p>
          <div className="flex flex-row gap-1 text-[10px] mt-4">
            Our Popular Categories:
            <span className="text-[9px] text-gray-400">
              <Link
                to="/terms-and-conditions"
                className="hover:text-black hover:underline transition-colors"
              >
                Terms & Conditions
              </Link>
            </span>
            <span className="text-gray-300">|</span>
            {popular.map((data, index) => (
              <span key={data.id}>
                <a
                  className="text-[9px] transition-all duration-300 text-gray-400 hover:text-black cursor-pointer"
                  href={data.link}
                >
                  {data.title}
                </a>
                {index !== popular.length - 1 && " | "}
              </span>
            ))}
          </div>
        </div>
      )}
      <p className="text-center mt-5 text-[13px]">© 2025 Uptownie.</p>
    </div>
  );
}

export default Footer;