import React, { useEffect } from "react";
import {
  FaRupeeSign,
  FaFemale,
  FaTags,
  FaFolderOpen,
  FaCertificate,
  FaUserTie,
  FaCloudUploadAlt,
  FaShareAlt,
  FaInstagram,
  FaObjectGroup,
  FaChartLine,
  FaEdit,
  FaCode,
  FaCopy,
} from "react-icons/fa";

const CampusAmbassador = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const benefits = [
    {
      icon: <FaRupeeSign className="text-3xl text-gray-600" />,
      title: "EARN MONEY",
      description:
        "Your efforts won't go unpaid. Get exciting bonuses for your campaigns!",
    },
    {
      icon: <FaFemale className="text-3xl text-gray-600" />,
      title: "STYLING",
      description:
        "Graduation coming up? Going on a date? Uptownie will style an outfit just for you for two events for absolutely no cost!",
    },
    {
      icon: <FaTags className="text-3xl text-gray-600" />,
      title: "DISCOUNTS",
      description:
        "Get discounts on our products which are specially valid for you for double the period you work with us. Exciting, isn't it?",
    },
    {
      icon: <FaFolderOpen className="text-3xl text-gray-600" />,
      title: "PORTFOLIO",
      description:
        "Uptownie will make your dream of having your very own portfolio come true! Now who would'nt want that?",
    },
    {
      icon: <FaCertificate className="text-3xl text-gray-600" />,
      title: "CERTIFICATE",
      description:
        "Get a certificate and Letter of Recommendation signed by the Founder of Uptownie 101",
    },
    {
      icon: <FaUserTie className="text-3xl text-gray-600" />,
      title: "MENTOR PROGRAMME",
      description:
        "You will also get a personal mentor who will provide you with hands on experience and training in the field of your interest",
    },
  ];

  const responsibilities = [
    {
      icon: <FaCloudUploadAlt className="text-5xl text-purple-600" />,
      title: "UPLOAD",
      description:
        "All you've got to do is upload pictures of yourself wearing Uptownie on your social media. Yes, it's that easy!",
    },
    {
      icon: <FaShareAlt className="text-5xl text-purple-600" />,
      title: "COMPETITIONS",
      description: "Hold fun competitions on Facebook and Instagram.",
    },
    {
      icon: <FaInstagram className="text-5xl text-purple-600" />,
      title: "PROMOTE US",
      description:
        "Endorse and Promote our brand during college fests. Wear Uptownie as you walk down the ramp and look glam as you work!",
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Top Section: Centered */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            Campus Ambassador Program
          </h1>
        </div>

        <div className="text-center space-y-6 mb-12">
          <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Hey Guys! Ever thought of gaining experience and knowledge and
            availing of exciting offers at the same time? That too without
            having to work 9-5?
          </p>
          <p className="text-gray-600 leading-relaxed">
            Impossible, you say? Nothing is impossible at Uptownie! All you need
            is creativity and enthusiasm!
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <img
            src="https://uptownie.com/cdn/shop/files/5_2_74cff514-5aba-455f-acde-bcc6a3ffb832_1349x.jpg?v=1653889662"
            alt="Become a Campus Ambassador"
            className="w-full max-w-6xl h-auto object-cover rounded-sm shadow-sm"
          />
        </div>
      </div>

      {/* Why Join Us Section: Full Width Container */}
      <div className="w-full bg-blue-50 py-16">
        {/* Using bg-blue-50 to mimic the verified section look, or just clean full width */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-gray-600 mb-2">
              Get Many Benefits
            </p>
            <h2 className="text-3xl font-bold font-serif">WHY JOIN US</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 text-center">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-4 px-2"
              >
                <div className="p-4 bg-white rounded-full mb-2 shadow-sm">
                  {benefit.icon}
                </div>
                <h3 className="text-pink-600 font-medium uppercase text-sm tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What You Need To Do Section: Full Width Container */}
      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-widest text-gray-600 mb-2">
              Be a Social Media Influencer
            </p>
            <h2 className="text-3xl font-bold font-serif uppercase">
              What You Need To Do
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left max-w-6xl mx-auto">
            {responsibilities.map((item, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-medium uppercase mb-3 text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-serif uppercase mb-5">
              GET TRAINED
            </h2>
            <p className="text-sm tracking-widest text-gray-600 mb-2">
              Hands on learning experience with special mentors in the fields
              you are interested in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-8xl mx-auto">
            {[
              {
                icon: <FaObjectGroup className="text-5xl text-black" />,
                title: "GRAPHIC DESIGNING",
              },
              {
                icon: <FaChartLine className="text-5xl text-black" />,
                title: "MARKETING",
              },
              {
                icon: <FaEdit className="text-5xl text-black" />,
                title: "CONTENT WRITING",
              },
              {
                icon: <FaFemale className="text-5xl text-black" />,
                title: "FASHION DESIGNING",
              },
              {
                icon: <FaCode className="text-5xl text-black" />,
                title: "INFORMATION TECHNOLOGY",
              },
              {
                icon: <FaCopy className="text-5xl text-black" />,
                title: "FINANCE",
              },
            ].map((field, index) => (
              <div
                key={index}
                className="bg-gray-100 py-12 px-6 flex flex-col items-center justify-center space-y-4 hover:shadow-md transition-shadow duration-300"
              >
                <div className="mb-2">{field.icon}</div>
                <h3 className="text-lg font-medium uppercase tracking-wide text-gray-900">
                  {field.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-2 text-center">
          <h2 className="text-3xl font-bold font-serif uppercase mb-12">
            HERE IS ALL YOU NEED TO DO -
          </h2>

          <div className="space-y-8">
            <div>
              <p className="text-lg font-medium mb-4">1. Upload your Resume</p>
              <button className="bg-purple-600 text-white px-8 py-3 rounded cursor-pointer hover:bg-purple-700 transition-colors uppercase font-medium tracking-wide">
                Upload your Resume
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Please note: If you have already uploaded your resume, then start
              filling up the form!
            </p>

            <div>
              <p className="text-lg font-medium mb-6">
                2. Fill up the form given below -
              </p>
              {/* Form Placeholder */}
              <div className="bg-gray-200 h-fit w-full rounded flex items-center justify-center bg-opacity-50">
                <img
                  src="https://uptownie.com/cdn/shop/files/5_2_74cff514-5aba-455f-acde-bcc6a3ffb832_1349x.jpg?v=1653889662"
                  className="text-4xl text-gray-400"
                />
                {/* Placeholder icon representing form */}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section inside the same container */}
        <div className="w-full pt-12">
          <div className="text-center">
            <p className="uppercase text-sm tracking-widest text-gray-600 mb-4">
              You can also contact us at
            </p>
            <a
              href="mailto:info@uptownie101.com"
              className="block text-gray-800 hover:text-purple-600 mb-2 font-medium"
            >
              info@uptownie101.com
            </a>
            <span className="text-gray-400 text-sm block mb-2">OR</span>
            <p className="text-gray-800 font-medium">
              Call us at +91 9674628107
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusAmbassador;