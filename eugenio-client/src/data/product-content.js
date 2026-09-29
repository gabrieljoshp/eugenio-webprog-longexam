const SERVER_ASSET_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const products = [
  {
    name: "nu-est-1900",
    title: "NU Est. 1900",
    category: "Caps",
    price: "₱950.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_est1900.png`,
    content: ["CAP | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-baller-band",
    title: "Baller Bands",
    category: "Accessories",
    price: "₱100.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_baller.png`,
    content: ["RUBBER BALLER | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-lanyard",
    title: "Lanyard",
    category: "Accessories",
    price: "₱250.00",
    stock: "Low stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_lanyard.png`,
    content: ["LANYARD | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-sticker-set",
    title: "Stickers Set",
    category: "Stickers",
    price: "₱150.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_stickers.png`,
    content: ["MULTI STICKERS | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-athletic-v2",
    title: "Athletic V2",
    category: "T-Shirts",
    price: "₱800.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_athleticv2.png`,
    content: ["ATHLETIC V2 T-SHIRT | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-sweater",
    title: "NU Sweater",
    category: "Sweaters",
    price: "₱1500.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_sweater.png`,
    content: ["SWEATER | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-varsity-jacket",
    title: "Varsity Jacket",
    category: "Jacket",
    price: "₱2250.00",
    stock: "Out of Stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_varsity.png`,
    content: ["VARSITY JACKET | NATIONAL UNIVERSITY"],
  },
  {
    name: "nu-scarf",
    title: "Scarf",
    category: "Scarves",
    price: "₱400.00",
    stock: "In stock",
    image: `${SERVER_ASSET_BASE_URL}/assets/nu_scarf.png`,
    content: ["SCARF | NATIONAL UNIVERSITY"],
  },
];

export default products;
