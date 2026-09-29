const mongoose = require("mongoose");
const Category = require("./models/categoryModel");
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Cart = require("./models/cartModel");
const Order = require("./models/orderModel");
const Review = require("./models/reviewModel");
const bcrypt = require("bcryptjs");
const { MONGO_DB_URL } = require("./config/config");

const seed = async () => {
  try {
    await mongoose.connect(MONGO_DB_URL);
    console.log("MongoDB connected for seeding...");

    // Clear the entire database
    await mongoose.connection.db.dropDatabase();

    await Promise.all([
      Category.deleteMany({}),
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
      Review.deleteMany({}),
    ]);

    // ==========================================
    // USERS
    // ==========================================

    const users = [
      {
        firstName: "Gabriel",
        lastName: "Eugenio",
        email: "gabriel@example.com",
        password: "Gabriel1!",
        contactNumber: "09058149617",
        address: "Taguig City",
        role: "admin",
        username: "gabriel",
        isActive: true,
      },
      {
        firstName: "Maria",
        lastName: "Santos",
        email: "maria@example.com",
        password: "secret123",
        contactNumber: "09181234567",
        address: "Makati City",
        role: "seller",
        username: "maria",
        isActive: true,
      },
      {
        firstName: "John",
        lastName: "Dela Cruz",
        email: "john@example.com",
        password: "secret123",
        contactNumber: "09191234567",
        address: "Cebu City",
        role: "customer",
        username: "john",
        isActive: true,
      },
    ];

    const savedUsers = await User.insertMany(
      await Promise.all(
        users.map(async (user) => ({
          ...user,
          password: await bcrypt.hash(user.password, 10),
        })),
      ),
    );

    // ==========================================
    // CATEGORIES
    // ==========================================

    const savedCategories = await Category.insertMany([
      {
        name: "Caps",
        slug: "caps",
        description: "National University caps and headwear",
        isActive: true,
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "National University accessories",
        isActive: true,
      },
      {
        name: "Stickers",
        slug: "stickers",
        description: "National University sticker products",
        isActive: true,
      },
      {
        name: "T-Shirts",
        slug: "t-shirts",
        description: "National University shirts and athletic wear",
        isActive: true,
      },
      {
        name: "Sweaters",
        slug: "sweaters",
        description: "National University sweaters",
        isActive: true,
      },
      {
        name: "Jacket",
        slug: "jacket",
        description: "National University jackets",
        isActive: true,
      },
      {
        name: "Scarves",
        slug: "scarves",
        description: "National University scarves",
        isActive: true,
      },
    ]);

    // ==========================================
    // PRODUCTS
    // Old products content.js product list
    // ==========================================

    const products = await Product.insertMany([
      // 1. NU Est. 1900
      {
        productName: "NU Est. 1900",
        slug: "nu-est-1900",
        description: "CAP | NATIONAL UNIVERSITY",
        price: 950,
        compareAtPrice: 1100,
        stock: 20,
        category: savedCategories[0]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_est1900.png"],
        tags: ["cap", "national university", "nu"],
        isFeatured: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 15,
        inventoryStatus: "In stock",
      },

      // 2. Baller Bands
      {
        productName: "Baller Bands",
        slug: "nu-baller-band",
        description: "RUBBER BALLER | NATIONAL UNIVERSITY",
        price: 100,
        compareAtPrice: 120,
        stock: 50,
        category: savedCategories[1]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_baller.png"],
        tags: ["baller", "rubber band", "accessories", "nu"],
        isFeatured: false,
        isActive: true,
        rating: 4.5,
        reviewCount: 10,
        inventoryStatus: "In stock",
      },

      // 3. Lanyard
      {
        productName: "Lanyard",
        slug: "nu-lanyard",
        description: "LANYARD | NATIONAL UNIVERSITY",
        price: 250,
        compareAtPrice: 300,
        stock: 5,
        category: savedCategories[1]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_lanyard.png"],
        tags: ["lanyard", "accessories", "id holder", "nu"],
        isFeatured: false,
        isActive: true,
        rating: 4.5,
        reviewCount: 9,
        inventoryStatus: "Low stock",
      },

      // 4. Stickers Set
      {
        productName: "Stickers Set",
        slug: "nu-sticker-set",
        description: "MULTI STICKERS | NATIONAL UNIVERSITY",
        price: 150,
        compareAtPrice: 200,
        stock: 30,
        category: savedCategories[2]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_stickers.png"],
        tags: ["stickers", "stationery", "nu", "national university"],
        isFeatured: true,
        isActive: true,
        rating: 4.6,
        reviewCount: 12,
        inventoryStatus: "In stock",
      },

      // 5. Athletic V2
      {
        productName: "Athletic V2",
        slug: "nu-athletic-v2",
        description: "ATHLETIC V2 T-SHIRT | NATIONAL UNIVERSITY",
        price: 800,
        compareAtPrice: 950,
        stock: 18,
        category: savedCategories[3]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_athleticv2.png"],
        tags: ["t-shirt", "athletic", "shirt", "nu"],
        isFeatured: true,
        isActive: true,
        rating: 4.8,
        reviewCount: 20,
        inventoryStatus: "In stock",
      },

      // 6. NU Sweater
      {
        productName: "NU Sweater",
        slug: "nu-sweater",
        description: "SWEATER | NATIONAL UNIVERSITY",
        price: 1500,
        compareAtPrice: 1700,
        stock: 15,
        category: savedCategories[4]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_sweater.png"],
        tags: ["sweater", "apparel", "nu", "national university"],
        isFeatured: true,
        isActive: true,
        rating: 4.7,
        reviewCount: 16,
        inventoryStatus: "In stock",
      },

      // 7. Varsity Jacket
      {
        productName: "Varsity Jacket",
        slug: "nu-varsity-jacket",
        description: "VARSITY JACKET | NATIONAL UNIVERSITY",
        price: 2250,
        compareAtPrice: 2600,
        stock: 0,
        category: savedCategories[5]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_varsity.png"],
        tags: ["jacket", "varsity", "apparel", "nu"],
        isFeatured: true,
        isActive: true,
        rating: 4.8,
        reviewCount: 18,
        inventoryStatus: "Out of stock",
      },

      // 8. Scarf
      {
        productName: "Scarf",
        slug: "nu-scarf",
        description: "SCARF | NATIONAL UNIVERSITY",
        price: 400,
        compareAtPrice: 500,
        stock: 22,
        category: savedCategories[6]._id,
        seller: savedUsers[1]._id,
        images: ["/assets/nu_scarf.png"],
        tags: ["scarf", "accessories", "apparel", "nu"],
        isFeatured: false,
        isActive: true,
        rating: 4.4,
        reviewCount: 8,
        inventoryStatus: "In stock",
      },
    ]);

    // ==========================================
    // CARTS
    // ==========================================

    await Cart.insertMany([
      {
        user: savedUsers[2]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
          {
            product: products[3]._id,
            quantity: 2,
            price: products[3].price,
          },
        ],
        subtotal: products[0].price + products[3].price * 2,
        itemCount: 3,
      },

      {
        user: savedUsers[0]._id,
        items: [
          {
            product: products[1]._id,
            quantity: 2,
            price: products[1].price,
          },
          {
            product: products[4]._id,
            quantity: 1,
            price: products[4].price,
          },
        ],
        subtotal: products[1].price * 2 + products[4].price,
        itemCount: 3,
      },

      {
        user: savedUsers[1]._id,
        items: [
          {
            product: products[5]._id,
            quantity: 1,
            price: products[5].price,
          },
        ],
        subtotal: products[5].price,
        itemCount: 1,
      },
    ]);

    // ==========================================
    // ORDERS
    // ==========================================

    await Order.insertMany([
      {
        orderNumber: "ORD-1001",
        user: savedUsers[2]._id,
        items: [
          {
            product: products[4]._id,
            quantity: 1,
            price: products[4].price,
          },
        ],
        subtotal: products[4].price,
        shippingFee: 60,
        total: products[4].price + 60,
        status: "pending",
        paymentMethod: "gcash",
        shippingAddress: "123 Taft Avenue, Manila",
      },

      {
        orderNumber: "ORD-1002",
        user: savedUsers[0]._id,
        items: [
          {
            product: products[0]._id,
            quantity: 1,
            price: products[0].price,
          },
          {
            product: products[1]._id,
            quantity: 2,
            price: products[1].price,
          },
        ],
        subtotal: products[0].price + products[1].price * 2,
        shippingFee: 60,
        total: products[0].price + products[1].price * 2 + 60,
        status: "processing",
        paymentMethod: "card",
        shippingAddress: "789 Katipunan Avenue, Quezon City",
      },

      {
        orderNumber: "ORD-1003",
        user: savedUsers[1]._id,
        items: [
          {
            product: products[5]._id,
            quantity: 1,
            price: products[5].price,
          },
        ],
        subtotal: products[5].price,
        shippingFee: 60,
        total: products[5].price + 60,
        status: "shipped",
        paymentMethod: "cash",
        shippingAddress: "456 Davao Road, Davao City",
      },
    ]);

    // ==========================================
    // REVIEWS
    // ==========================================

    await Review.insertMany([
      {
        product: products[0]._id,
        user: savedUsers[2]._id,
        rating: 5,
        title: "Great cap",
        comment: "Comfortable and looks great with my NU outfit.",
        isVerifiedPurchase: true,
      },

      {
        product: products[2]._id,
        user: savedUsers[0]._id,
        rating: 4,
        title: "Useful lanyard",
        comment: "Good quality and useful for my student ID.",
        isVerifiedPurchase: true,
      },

      {
        product: products[4]._id,
        user: savedUsers[2]._id,
        rating: 5,
        title: "Excellent shirt",
        comment: "The Athletic V2 shirt is comfortable and fits well.",
        isVerifiedPurchase: true,
      },

      {
        product: products[5]._id,
        user: savedUsers[0]._id,
        rating: 5,
        title: "Very comfortable",
        comment: "The sweater is comfortable and perfect for campus.",
        isVerifiedPurchase: true,
      },

      {
        product: products[7]._id,
        user: savedUsers[2]._id,
        rating: 4,
        title: "Nice scarf",
        comment: "Lightweight and looks good with my NU apparel.",
        isVerifiedPurchase: true,
      },
    ]);

    console.log("Seed data inserted successfully!");
    console.log(`${products.length} products inserted successfully.`);

    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seed();
