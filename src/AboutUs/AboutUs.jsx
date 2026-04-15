import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 animate-fade-in text-center font-sans">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-normal mb-4 font-serif text-gray-900">
          About Us
        </h1>
        <div className="text-gray-500 text-sm breadcrumbs">
          <Link to="/" className="hover:text-gray-800">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span>About Us</span>
        </div>
      </div>

      <div className="space-y-12">
        {/* Our Story */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">
            Our Story: Of Perseverance and Growth
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
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
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Since the birth of Uptownie in 2015, we have connected with over 10
            lakh customers. Today, our products have a nationwide presence and
            can be found on our website -{" "}
            <a
              href="https://www.uptownie.com"
              className="underline text-gray-800"
            >
              www.uptownie.com
            </a>{" "}
            as well as e-commerce stores such as Myntra, Jabong, Flipkart,
            Amazon, Nykaa Fashion, and Ajio.
          </p>
        </section>

        {/* Our Process */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">
            Our Process: Of Simplicity and Sustainability
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            We adopt global micro trends and design apparel, accessories, and
            footwear that align with the preferences of Indian women bearing in
            mind their height, weight, complexion, figure, and body type. An
            Uptownie outfit is hands down the most fuss-free and frequently worn
            clothing in any wardrobe.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Our quality is our strength. Our factory, in Ganganagar, West
            Bengal, runs on the simple principle of producing clothes that are
            durable, affordable, and fashionable. To keep up with the
            fast-moving trends, we update our online catalogues weekly and
            refresh them with a range of styles for every occasion. More
            importantly, each piece upholds the promise of quality, comfort, and
            durability. Our work is certified by SGS - the world's largest
            quality testing agency.
          </p>
        </section>

        {/* Image */}
        <div className="py-8 flex justify-center">
          <div className="overflow-hidden max-w-2xl">
            <img
              src="https://cdn.shopify.com/s/files/1/1780/3381/files/new.jpg?16213654262975953248"
              alt="Uptownie Style"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Founder Header */}
        <div className="text-center pt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Priyanka Agarwal
          </h2>
          <div className="bg-[#E91E63] text-white py-2 px-6 inline-block text-lg font-medium tracking-wide shadow-sm">
            stay.bomb.diggity
          </div>
        </div>

        {/* Founder Bio */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">
            Our Founder: Of Leadership and Strength
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Priyanka Agarwal is an entrepreneur and a fashion enthusiast with a
            keen eye for aesthetics, detail, and design. Uptownie was born out
            of her desire to empower Indian women with affordable and fuss-free
            clothing that complements their body type and physicality.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Priyanka graduated from Duke University with a Bachelor of Science
            (BSc) in Economics and Math, and a specialization in Marketing and
            Visual Arts. Her work at Uptownie is a blend of fortes gathered
            through her years as a student. She also draws upon 40 years of her
            family's experience within the fields of manufacturing and exports,
            to bring perfection to the production process.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
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
        </section>

        {/* Team */}
        <section className="space-y-6">
          <h2 className="text-lg font-bold text-gray-900">
            Our Team: Of Passion and Fashion
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            The driving force of the company is a team of young and urban Indian
            women who wear the shoes of our customers in every step of their
            way. We design fuss-free and chic clothes, keeping in mind that no
            one has the time for endless ironing, slips, nips and tucks,
            shoulders that slip off, or unflattering cuts.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            Our digital store is run by 50 young men and women who work across
            all departments: from marketing and designing, to warehousing, with
            a gusto for growth. The Uptownie office is a space of equal
            opportunity and a conducive environment for tremendous growth in the
            field of fashion.
          </p>
          <p className="text-gray-600 leading-relaxed text-sm md:text-base">
            We envision a world where every body shape and size is celebrated.
            Your outfit is never "too bold" or "too well-fitted" or "too
            casual," it is always a personal expression of your inner beauty.
            Scrolling through our store is never a hunt for what's good, but
            always a tough pick between many great choices.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;