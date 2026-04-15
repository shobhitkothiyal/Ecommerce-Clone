const ProductData = [
  {
    id: 1,
    title: "Pure Cotton Smocked Midi Dress",
    rating: 4.5,
    reviews: 128,
    discountedPercent: 32,
    description:
      "A beautiful pure cotton smocked midi dress perfect for summer. Breathable fabric and flattering fit.",
    variants: [
      {
        color: "Coral Red",
        hex: "#F87171",
        basePrice: 3499,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_30-12.png?v=1767262274",
          "https://uptownie.com/cdn/shop/files/12_7ee29563-5842-407c-b6e0-db54e5866d12.png?v=1767262274",
          "https://uptownie.com/cdn/shop/files/15_d5ea3816-4e39-479b-a342-dd0ec465a360.png?v=1767262274",
        ],
        stock: {
          XS: 5,
          S: 10,
          M: 0,
          L: 3,
          XL: 2,
          XXL: 1,
        },
      },
      {
        color: "Green",
        hex: "#10B981",
        basePrice: 3199,
        images: [
          "https://uptownie.com/cdn/shop/files/32_ff70301f-0c2f-42e0-9e25-c2162b0ab385_720x.png?v=1767262274",
          "https://uptownie.com/cdn/shop/files/2image7_10_720x.jpg?v=1767262274",
          "https://uptownie.com/cdn/shop/files/1_85_3fc6e712-6793-4530-b488-bcfcd2a7347c_720x.jpg?v=1767262274",
        ],
        stock: {
          XS: 2,
          S: 6,
          M: 8,
          L: 1,
          XL: 4,
          XXL: 2,
        },
      },
      {
        color: "Lime green",
        hex: "#C6E48B",
        basePrice: 3499,
        images: [
          "https://uptownie.com/cdn/shop/files/7_33c9888c-7e4f-454b-ab26-7a4cd2e4db8d_720x.png?v=1767262274",
          "https://uptownie.com/cdn/shop/files/6_167e8ab0-be4b-4a98-990a-f62a55d991fa_720x.png?v=1767262274",
          "https://uptownie.com/cdn/shop/files/8_54ed5a37-7637-4cdb-b8bb-c72f57b270ec_720x.png?v=1767262274",
        ],
        stock: { S: 5, M: 5, L: 5 },
      },
    ],
    details: {
      fabric: "100% Cotton",
      fit: "Regular Fit",
      neck: "Square Neck",
      sleeve: "Sleeveless",
      length: "Midi",
    },
  },
  {
    id: 2,
    title: "Stretchable Backless Midi Dress",
    rating: 4.2,
    reviews: 85,
    discountedPercent: 44,
    description:
      "Elegant stretchable backless midi dress for evening wear. Features a stunning back design.",
    variants: [
      {
        color: "Red",
        hex: "#EF4444",
        basePrice: 2999,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_12_540x.png?v=1766559661",
          "https://uptownie.com/cdn/shop/files/365_2620a327-6d7a-4424-8377-6e0459aaa8cb_540x.png?v=1766559661",
        ],
        stock: { S: 5, M: 2, L: 0, XL: 1 },
      },
      {
        color: "Black",
        hex: "#000000",
        basePrice: 2999,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_12_540x.png?v=1766559661",
        ],
        stock: { S: 5, M: 5, L: 5, XL: 5 },
      },
    ],
    details: {
      fabric: "Polyester Blend",
      fit: "Bodycon",
      neck: "Round Neck",
      sleeve: "Short Sleeve",
      length: "Midi",
    },
  },
  {
    id: 3,
    title: "Stretchable Gold Accent Wrap Top",
    rating: 4.7,
    reviews: 32,
    discountedPercent: 30,
    description:
      "Chic wrap top with gold accents, perfect for work or casual outings.",
    variants: [
      {
        color: "Beige",
        hex: "#D2B48C",
        basePrice: 1999,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_13_540x.png?v=1766559695",
        ],
        stock: { XS: 3, S: 8, M: 10, L: 4, XL: 2 },
      },
    ],
    details: {
      fabric: "Cotton Blend",
      fit: "Regular Fit",
      neck: "V-Neck",
      sleeve: "Long Sleeve",
      length: "Regular",
    },
  },
  {
    id: 4,
    title: "Pure Cotton Flared Shirt Dress With Belt",
    rating: 4.6,
    reviews: 156,
    discountedPercent: 41,
    description:
      "Stylish flared shirt dress with a belt. Offers a sophisticated look with comfort.",
    variants: [
      {
        color: "Pink",
        hex: "#DB2777",
        basePrice: 4699,
        images: [
          "https://uptownie.com/cdn/shop/files/41_358f909f-31b4-4899-97a1-a5905ef43fc2_540x.png?v=1766559494",
          "https://uptownie.com/cdn/shop/files/351_f56070ce-8f28-4f11-ac18-3847e86589d0_540x.png?v=1766559494",
        ],
        stock: { S: 5, M: 5, L: 5, XL: 5, XXL: 5 },
      },
      {
        color: "Orange",
        hex: "#F97316",
        basePrice: 4699,
        images: [
          "https://uptownie.com/cdn/shop/files/41_358f909f-31b4-4899-97a1-a5905ef43fc2_540x.png?v=1766559494",
        ],
        stock: { S: 5, M: 5, L: 5, XL: 5, XXL: 5 },
      },
    ],
    details: {
      fabric: "100% Cotton",
      fit: "Flared",
      neck: "Collar",
      sleeve: "Three-Quarter",
      length: "Midi",
    },
  },
  {
    id: 5,
    title: "Floral Print Maxi Dress",
    rating: 4.3,
    reviews: 94,
    discountedPercent: 43,
    description:
      "Flowy floral print maxi dress. Ideal for beach vacations and summer parties.",
    variants: [
      {
        color: "Green",
        hex: "#10B981",
        basePrice: 3499,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_14_540x.png?v=1766562247",
          "https://uptownie.com/cdn/shop/files/413_10d270ac-ac53-48b1-8439-12e0c9dd501b_540x.png?v=1766562247",
        ],
        stock: { M: 5, L: 5, XL: 5 },
      },
      {
        color: "Blue",
        hex: "#3B82F6",
        basePrice: 3499,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_14_540x.png?v=1766562247",
        ],
        stock: { M: 5, L: 5, XL: 5 },
      },
    ],
    details: {
      fabric: "Georgette",
      fit: "Relaxed",
      neck: "V-Neck",
      sleeve: "Sleeveless",
      length: "Maxi",
    },
  },
  {
    id: 6,
    title: "Satin Slip Dress",
    rating: 4.7,
    reviews: 302,
    discountedPercent: 50,
    description:
      "Luxurious satin slip dress. Smooth texture and elegant drape.",
    variants: [
      {
        color: "Purple",
        hex: "#8B5CF6",
        basePrice: 2599,
        images: [
          "https://uptownie.com/cdn/shop/files/16_f7f758d7-4cf0-423f-b46e-0de91b733f80_540x.png?v=1765953905",
          "https://uptownie.com/cdn/shop/files/240_89b4fd03-7def-442d-94f0-870f50255cd7_540x.png?v=1765953905",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5 },
      },
      {
        color: "Black",
        hex: "#000000",
        basePrice: 2599,
        images: [
          "https://uptownie.com/cdn/shop/files/16_f7f758d7-4cf0-423f-b46e-0de91b733f80_540x.png?v=1765953905",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5 },
      },
      {
        color: "Pink",
        hex: "#F472B6",
        basePrice: 2599,
        images: [
          "https://uptownie.com/cdn/shop/files/16_f7f758d7-4cf0-423f-b46e-0de91b733f80_540x.png?v=1765953905",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5 },
      },
    ],
    details: {
      fabric: "Satin",
      fit: "Slip",
      neck: "Cowl Neck",
      sleeve: "Strappy",
      length: "Midi",
    },
  },
  {
    id: 7,
    title: "Casual Denim Jacket",
    rating: 4.4,
    reviews: 112,
    discountedPercent: 50,
    description:
      "Classic casual denim jacket. A wardrobe essential that pairs with everything.",
    variants: [
      {
        color: "Blue",
        hex: "#3B82F6",
        basePrice: 2999,
        images: [
          "https://uptownie.com/cdn/shop/files/17_2ae65d84-c5ae-4ce4-bd37-d86977200b6e_540x.png?v=1765954440",
          "https://uptownie.com/cdn/shop/files/image_2_449_540x.png?v=1765954440",
        ],
        stock: { S: 5, M: 5, L: 5, XL: 5 },
      },
      {
        color: "Gray",
        hex: "#6B7280",
        basePrice: 2999,
        images: [
          "https://uptownie.com/cdn/shop/files/17_2ae65d84-c5ae-4ce4-bd37-d86977200b6e_540x.png?v=1765954440",
        ],
        stock: { S: 5, M: 5, L: 5, XL: 5 },
      },
    ],
    details: {
      fabric: "Denim",
      fit: "Regular",
      neck: "Collar",
      sleeve: "Long Sleeve",
      length: "Regular",
    },
  },
  {
    id: 8,
    title: "High Waist Wide Leg Trousers",
    rating: 4.5,
    reviews: 178,
    discountedPercent: 50,
    description:
      "Comfortable high waist wide leg trousers. Perfect for work or casual chic looks.",
    variants: [
      {
        color: "Mustard",
        hex: "#F59E0B",
        basePrice: 1999,
        images: [
          "https://uptownie.com/cdn/shop/files/20_6fc3d4a7-547f-4f20-8c22-7067894284c2_540x.png?v=1765954758",
          "https://uptownie.com/cdn/shop/files/497_810e97f9-5fdc-4cf5-8252-e6a1b71350ef_540x.png?v=1765954758",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5 },
      },
      {
        color: "Black",
        hex: "#000000",
        basePrice: 1999,
        images: [
          "https://uptownie.com/cdn/shop/files/20_6fc3d4a7-547f-4f20-8c22-7067894284c2_540x.png?v=1765954758",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5 },
      },
      {
        color: "White",
        hex: "#FFFFFF",
        basePrice: 1999,
        images: [
          "https://uptownie.com/cdn/shop/files/20_6fc3d4a7-547f-4f20-8c22-7067894284c2_540x.png?v=1765954758",
        ],
        stock: { XS: 5, S: 5, M: 5, L: 5, XL: 5 },
      },
    ],
    details: {
      fabric: "Polyester",
      fit: "Wide Leg",
      neck: "N/A",
      sleeve: "N/A",
      length: "Full Length",
    },
  },
  {
    id: 9,
    title: "Placeholder Product A",
    rating: 0,
    reviews: 0,
    discountedPercent: 20,
    description: "Description pending.",
    variants: [
      {
        color: "Gray",
        hex: "#D1D5DB",
        basePrice: 2499,
        images: [
          "https://uptownie.com/cdn/shop/files/website_new_launch_revamp_10-12_7_540x.png?v=1766037253",
          "https://uptownie.com/cdn/shop/files/275_079d2c95-e28a-40ba-bc82-29dce6cdb156_540x.png?v=1766037253",
        ],
        stock: { S: 5, M: 5, L: 5 },
      },
    ],
    details: {
      fabric: "N/A",
      fit: "N/A",
      neck: "N/A",
      sleeve: "N/A",
      length: "N/A",
    },
  },
  {
    id: 10,
    title: "Placeholder Product B",
    rating: 0,
    reviews: 0,
    discountedPercent: 43,
    description: "Description pending.",
    variants: [
      {
        color: "Dark Gray",
        hex: "#9CA3AF",
        basePrice: 1599,
        images: [
          "https://uptownie.com/cdn/shop/files/29_e88c3536-850b-4dc7-9dc1-bb223bae536b_540x.png?v=1767159388",
          "https://uptownie.com/cdn/shop/files/284_88d116d2-7f8a-4557-8e4b-b9af6091775c_540x.png?v=1767159388",
        ],
        stock: { S: 5, M: 5, L: 5 },
      },
    ],
    details: {
      fabric: "N/A",
      fit: "N/A",
      neck: "N/A",
      sleeve: "N/A",
      length: "N/A",
    },
  },
];

export default ProductData;