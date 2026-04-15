import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const privacyData = [
  {
    title: "Information Collection and Use",
    content: (
      <div className="space-y-4">
        <p>
          The Personal Information which You may provide to us and/or which we
          may collect is or could be the following:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>
            Your registration details which may include the password provided by
            You. You may note that We adopt reasonable security measures to
            protect Your password from being exposed or disclosed to anyone
            including the Company.
          </li>
          <li>
            Your shipping, billing, tax registration, and other information
            pertaining to Your sale or purchase transaction on the Website.
          </li>
          <li>Your transaction details with the other users of the Website.</li>
          <li>Your usage behavior of the Website.</li>
          <li>
            Details of the computer system or computer network which You use to
            visit the Website and undertake any activity on the Website.
          </li>
        </ol>
        <p>
          Our primary purposes in collecting information from You are to allow
          You to use the Website and various features and services offered by
          the Company on or in relation to the Website; contact you for any
          services provided by the Company or its affiliates or its business
          partners and advertisers; to record Your information and details as
          permitted and required under applicable laws, statutory direction or
          judiciary orders; to serve various promotion materials and advertising
          materials to you; and such other uses as provided in the User
          Agreement and this Privacy Policy. We may also use the information for
          transactional emails or to provide You with information, direct
          marketing, online and offline advertising and other materials
          regarding products, services and other offers from time to time in
          connection with the Company or its parent, subsidiary and affiliated
          companies ("Company Entities") and its joint ventures. We may also
          collect information to track User behavior and preferences for
          internal analytics from all Users of the Website. This information is
          collected through the use of server log files and tracking
          technologies to collect and analyze certain types of technical
          information and may include cookies and web beacons.
        </p>
        <p>
          We may combine your Personal Information, other information and
          information collected from tracking technologies and aggregate it with
          information collected from other Users using our Website to attempt to
          provide You with a better experience on our Website.
        </p>
        <p>
          You understand, agree and acknowledge that our collection, storage and
          processing of your Personal Information is for a lawful purpose
          connected with a function or activity of the Company Entities and its
          joint ventures. You further understand, agree and acknowledge that
          your Personal Information which is classified as sensitive personal
          information as per applicable laws is considered necessary for the
          Company to provide various services on its Website to You and for Your
          usage of the Website and other services provided by Company in
          relation to the Website.
        </p>
      </div>
    ),
  },
  {
    title: "Information Sharing and Disclosure",
    content: (
      <div className="space-y-4">
        <p>
          Company is the recipient of all the Personal Information and shall
          exercise reasonable commercial endeavors for the prevention of the
          Personal Information provided by the Users. We may enable access of
          the Users' information to the Company Entities, joint ventures, agents
          or third parties for the purposes of the services provided by them or
          for any other marketing related activity undertaken by or on behalf of
          the Company Entities and/or its joint ventures. We will ensure on
          reasonable commercial efforts basis that the third parties and agents
          employed by us for the purposes of the Website are under an obligation
          to maintain confidentiality with respect to the Personal Information
          provided by the Users and to use it strictly for the purposes of the
          Website only.
        </p>
        <p>
          Company may disclose your Personal Information to such extent as the
          Company may deem necessary for you to enter into commercial
          transactions with other users of the Website.
        </p>
      </div>
    ),
  },
  {
    title: "Compliance with Laws and Law Enforcement",
    content: (
      <p>
        Company cooperates with mandated government and law enforcement agencies
        or to any third parties by an order under law for the time being in
        force to enforce and comply with the law. We will disclose any
        information about You to government or law enforcement officials or
        private parties as we, in our sole discretion, believe necessary or
        appropriate to respond to claims and legal process, to protect the
        property and rights of Company or a third party, to protect the safety
        of the public or any person, or to prevent or stop any illegal,
        unethical or legally actionable activity. Company may also provide your
        Personal Information to various tax authorities upon any demand or
        request from them.
      </p>
    ),
  },
  {
    title: "Business Transfers",
    content: (
      <p>
        Company may sell, transfer or otherwise share some or all of its assets,
        including your Personal Information, in connection with a merger,
        acquisition, reorganization or sale of assets or in the event of
        bankruptcy. Should such a sale or transfer occur, we will ensure that
        the Personal Information You have provided through the Website is stored
        and used by the transferee in a manner that is consistent with this
        Privacy Policy.
      </p>
    ),
  },
  {
    title: "Email Policies",
    content: (
      <p>
        Company may use your Personal Information for the aforementioned
        purposes of the Website. You have full control regarding which of these
        emails You want to receive. If You decide at any time that You no longer
        wish to receive such communications from us, please follow the
        unsubscribe instructions provided in any of the communications. Please
        note that once we receive your request, it may take an additional period
        of time for your opt-out to become effective.
      </p>
    ),
  },
  {
    title: "Deleting Your Information",
    content: (
      <p>
        If You wish to have the Personal Information that You have provided to
        us deleted, You can always do so by sending a request to us on the
        e-mail id of our Customer Services department provided at the bottom of
        this page. You may note that deletion of certain Personal Information
        may lead to cancellation of your registration with the Website and your
        access to certain features of the Website.
      </p>
    ),
  },
  {
    title: "Security",
    content: (
      <div className="space-y-4">
        <p>
          Company uses ordinary industry standard technology designed to help
          keep your Personal Information safe. The secure server software (SSL)
          encrypts all information You put in before it is sent to us.
          Furthermore, all of the customer data we collect is protected against
          unauthorized access. To prevent unauthorized access, maintain data
          accuracy, and ensure correct use of information, We will employ
          commercially reasonable and practicable security practices and
          procedures and security methods and technologies. We will also ensure
          on reasonable commercial efforts basis that any agent or third party
          that we employ complies with the same security standards as us for the
          protection of your Personal Information.
        </p>
        <p>
          Your information may be transferred to or be maintained on computers,
          computer systems and computer resources located outside of your state
          or country where the privacy laws may not be as protective as those
          where you live. If You are located outside India and choose to provide
          information to us, please be aware that Company keeps or transfers
          information to India and processes it there. Your submission of such
          information represents your agreement to that transfer.
        </p>
        <p>
          Unfortunately, the transmission of information over the Internet is
          not completely secure. Although We strive to protect your personal
          data, We cannot guarantee the security of your data while it is being
          transmitted to our site; any transmission is at your own risk. Once We
          have received your information, We have commercially reasonable
          procedures and security features in place to reasonably endeavor to
          prevent unauthorized access.
        </p>
      </div>
    ),
  },
  {
    title: "Changes in Privacy Policy",
    content: (
      <p>
        From time to time We may update this Privacy Policy. Your continued
        subscription to our Services constitutes an acceptance of the
        then-current Privacy Policy and Terms of Use so We encourage You to
        visit this page periodically to review any changes.
      </p>
    ),
  },
  {
    title: "Phishing",
    content: (
      <p>
        Identity theft and the practice currently known as "phishing" are of
        great concern to Company. Safeguarding information to help protect You
        from identity theft is a top priority. We do not and will not, at any
        time, request your credit card information or national identification
        numbers in a non-secure or unsolicited e-mail or telephone
        communication.
      </p>
    ),
  },
  {
    title: "SMS Policies",
    content: (
      <div className="space-y-4">
        <p>
          When you transact with us, we collect and use your contact details to
          provide relevant offers and product information to you via SMS. When
          confirming your order, you hereby expressly agree to share your
          contact details with us for the mentioned services. If you do not wish
          to be contacted about our products and services, please contact us at
        </p>
        <p>
          Phone : +91-97118 87220
          <br />
          Email :customerservice@uptownie101.com
        </p>
      </div>
    ),
  },
  {
    title: "Cookies",
    content: (
      <div className="space-y-4">
        <p>
          Cookies are files, often including unique identifiers, that are sent
          by web servers to web browsers, and which may then be sent back to the
          server each time the browser requests a page from the server. Cookies
          can be used by web servers to identity and track users as they
          navigate different pages on a website, and to identify users returning
          to a website. Cookies may be either "persistent" cookies or "session"
          cookies. Uptownie does not use cookies to save Personal Information
          for outside uses.
        </p>
        <p>
          We have implemented Google Analytics features based on Display
          Advertising (Google Display Network Impression Reporting, and Google
          Analytics Demographics and Interest Reporting). Visitors can opt out
          of Google Analytics for Display Advertising and customize Google
          Display Network ads using the Ads Settings.
        </p>
        <p>
          We, along with third-party vendors, including Google, use first-party
          cookies (such as the Google Analytics cookies) and third-party cookies
          together to report how our ad impressions, other uses of ad services,
          and interactions with these ad impressions and ad services are related
          to visits to our site.
        </p>
      </div>
    ),
  },
  {
    title: "Contact Us",
    content: (
      <div className="space-y-4">
        <p>
          If You have any questions about this Privacy Policy, the practices of
          Company or your dealings with the Website, You can contact us at-
        </p>
        <p>
          P Inspiration
          <br />
          1st Floor Shreekunj Apartment
          <br />
          6 Alipore Avenue
          <br />
          Kolkata
          <br />
          West Bengal - 700027
          <br />
          Phone:+91-97118 87220
          <br />
          Email:customerservice@uptownie101.com
          <br />
          Time:Monday to Sunday - 10:00AM - 7:00PM
        </p>
      </div>
    ),
  },
];

const PrivacyPolicy = () => {
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
          Privacy Policy
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span>&gt;</span>
          <span>Privacy Policy</span>
        </div>
      </div>

      {/* Intro Text */}
      <div className="mb-8 text-gray-700 text-sm md:text-base leading-relaxed text-justify">
        <p>
          This Privacy Policy covers the information P Inspiration ("Company"
          and/or "We") collects from the user(s) ("User(s)" and/or "You") of
          www.uptownie.com ("Website") This Privacy Policy should be read in
          conjunction and together with the User Agreement of the Website.
          Personal Information of a User(s) is collected if the User(s)
          registers with the Website, accesses the Website or take any action on
          the Website.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-4">
        {privacyData.map((item, index) => (
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
                {item.title}
              </span>
              <span className="text-gray-400 ml-4">
                {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-250 opacity-100 mb-4"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="text-gray-600 text-sm md:text-base leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;