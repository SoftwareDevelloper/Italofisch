const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://hopehorizon62_db_user:Q39bvVdzVK4Q40TO@cluster0.fiaerlo.mongodb.net/FishCatalog",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.get("/", (req, res) => {
  res.send("Express App is Running");
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Sea Food Crud  operation
const upload = multer({ storage: storage });

app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

const SeaFood = mongoose.model("SeaFood", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

app.post("/addSeaFood", async (req, res) => {
  try {
    const seafoodList = await SeaFood.find({});
    let id;
    if (seafoodList.length > 0) {
      let last_product = seafoodList[seafoodList.length - 1];
      id = last_product.id + 1;
    } else {
      id = 1;
    }
    if (
      !req.body.name ||
      !req.body.description ||
      !req.body.image ||
      !req.body.category ||
      !req.body.weight ||
      !req.body.price
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }
    const seaFood = new SeaFood({
      id,
      name: req.body.name,
      description: req.body.description,
      image: req.body.image,
      category: req.body.category,
      weight: Number(req.body.weight),
      price: Number(req.body.price),
    });
    await seaFood.save();
    res.status(201).json({
      success: true,
      message: "Seafood added successfully",
      seaFood,
    });
  } catch (error) {
    console.error("Error adding seafood:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.get("/GetAllSeaFood", async (req, res) => {
  try {
    let seafood = await SeaFood.find({}).sort({ orderDate: -1 });
    res.status(200).json({ message: seafood });
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});
app.get("/Get5SeaFood", async (req, res) => {
  try {
    let seafood = await SeaFood.find({}).sort({ orderDate: -1 });
    let FrechSeaFood = seafood.slice(1).slice(-6);
    res.status(200).json({ message: FrechSeaFood });
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});
app.get("/GetSeaFood/:id", async (req, res) => {
  try {
    const seafood = await SeaFood.findOne({ id: req.params.id });
    if (!seafood) {
      return res.status(404).json({ message: "Seafood not found" });
    }
    res.status(200).json(seafood);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/RemoveSeaFood/:id", async (req, res) => {
  try {
    let seafood = await SeaFood.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ message: "Seafood deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});
//update seafood
app.put("/UpdateSeaFood/:id", upload.single("image"), async (req, res) => {
  try {
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      weight: Number(req.body.weight),
      price: Number(req.body.price),
    };
    if (req.file) {
      updatedData.image = `http://localhost:${port}/images/${req.file.filename}`;
    } else if (req.body.image) {
      updatedData.image = req.body.image;
    }

    const seafood = await SeaFood.findOneAndUpdate(
      { id: req.params.id },
      updatedData,
      { new: true }
    );

    res.status(200).json(seafood);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


// User
const User = mongoose.model("User", {
  id: {
    type: Number,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  cartData: {
    type: Object,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
//User Authentication

app.post("/signup", async (req, res) => {
  let check = await User.findOne({ email: req.body.email });
  if (check) {
    return res
      .status(400)
      .json({
        success: false,
        errors: "existing user found with the same email address",
      });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const lastUser = await User.findOne().sort({ id: -1 });
  const newId = lastUser ? lastUser.id + 1 : 1;
  const user = new User({
    id: newId,
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    cartData: {},
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});
// creating endpoint for userlogin
app.post("/login", async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong Email Id" });
  }
});
app.get("/getAllUsers", async (req, res) => {
  try {
    let users = await User.find({}).sort({ orderDate: -1 });
    res.status(200).json({ message: users });
  }
  catch (error) {
    res.status(500).json({ error: message.error });
  }
});
app.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/RemoveUser/:id", async (req, res) => {
  try {
    let user = await User.findOneAndDelete({ id: req.params.id });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: message.error });
  }
});

// User Middleware
const ValidateUser = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res
      .status(401)
      .send({ errors: "Please authenticate using a valid token" });
  }

  const token = authHeader.split(" ")[1]; // extract token part

  try {
    const data = jwt.verify(token, "secret_ecom");
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ errors: "Please authenticate using a valid token" });
  }
};
//User Crud Operation
// get logged-in user details
app.get("/Profile", ValidateUser, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// Get all seafoods by category
app.get("/Types", async (req, res) => {
  try {
    const { category } = req.query; // <-- Use query, not body
    console.log("Requested category:", category);

    const seafood =
      category === "all"
        ? await SeaFood.find()
        : await SeaFood.find({ category });
    res.status(200).json(seafood);
  } catch (error) {
    console.error("Error fetching Seafood:", error);
    res.status(500).json({ errors: "Failed to fetch Seafood" });
  }
});

// Get seafoods by price range
app.get("/Price", async (req, res) => {
  try {
    const { min, max } = req.query;
    console.log("Requested price range:", min, max);

    const seafood = await SeaFood.find({
      price: { $gte: Number(min), $lte: Number(max) },
    });
    res.status(200).json(seafood);
  } catch (error) {
    console.error("Error fetching Seafood:", error);
    res.status(500).json({ errors: "Failed to fetch Seafood" });
  }
});

// Get seafoods by both price & category
app.get("/PriceAndTypes", async (req, res) => {
  try {
    const { min, max, category } = req.query;
    console.log("Requested:", min, max, category);

    let filter = { price: { $gte: Number(min), $lte: Number(max) } };
    if (category !== "all") filter.category = category;

    const seafood = await SeaFood.find(filter);
    res.status(200).json(seafood);
  } catch (error) {
    console.error("Error fetching Seafood:", error);
    res.status(500).json({ errors: "Failed to fetch Seafood" });
  }
});

// Reset filter
app.get("/ResetFilter", async (req, res) => {
  try {
    const seafood = await SeaFood.find();
    res.status(200).json(seafood);
  } catch (error) {
    console.error("Error fetching Seafood:", error);
    res.status(500).json({ errors: "Failed to fetch Seafood" });
  }
});

// Add To cart
app.post("/Addtocart", ValidateUser, async (req, res) => {
  const { itemId, quantity } = req.body;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, error: "Item ID is required" });
  }
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (!user.cartData) {
      user.cartData = {};
    }
    if (!user.cartData[itemId]) {
      user.cartData[itemId] = 0;
    }
    user.cartData[itemId] += quantity && quantity > 0 ? quantity : 1;
    await User.findOneAndUpdate(
      { id: req.user.id },
      { cartData: user.cartData }
    );

    res.json({
      success: true,
      message: `Added ${quantity || 1} item(s) to cart`,
    });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// create endpoind for fetch cart data into the cart page
app.get("/getCart", ValidateUser, async (req, res) => {
  try {
    const userData = await User.findOne({ id: req.user.id });

    if (!userData || !userData.cartData) {
      return res.status(200).json({ success: true, cart: [] });
    }

    const cartData = userData.cartData;

    const cartItems = [];
    for (const itemId in cartData) {
      if (cartData[itemId] > 0) {
        const product = await SeaFood.findOne({ id: parseInt(itemId) });
        if (product) {
          cartItems.push({
            ...product._doc,
            quantity: cartData[itemId],
          });
        }
      }
    }

    res.json({ success: true, cart: cartItems });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
// Get cart count for a user
app.get("/cart/count", ValidateUser, async (req, res) => {
  try {
    const userData = await User.findOne({ id: req.user.id });

    if (!userData || !userData.cartData) {
      return res.json({ success: true, count: 0 });
    }

    const totalItems = Object.values(userData.cartData).reduce(
      (sum, qty) => sum + qty,
      0
    );

    res.json({ success: true, count: totalItems });
  } catch (error) {
    console.error("Error fetching cart count:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// create endpoint for remove item from cart data
app.post("/RemoveFromCart", ValidateUser, async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    return res
      .status(400)
      .json({ success: false, error: "Item ID is required" });
  }
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (!user.cartData) {
      user.cartData = {};
    }
    if (!user.cartData[itemId]) {
      user.cartData[itemId] = 0;
    }
    user.cartData[itemId] -= 1;
    await User.findOneAndUpdate(
      { id: req.user.id },
      { cartData: user.cartData }
    );

    res.json({ success: true, message: "Item Removed from cart" });
  } catch (error) {
    console.error("Error Removed item from cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
// Clear cart
app.post("/ClearCart", ValidateUser, async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id });
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    user.cartData = {}; // empty the cart
    await user.save();

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Orders
const Orders = mongoose.model("Orders", {
  userId: {
    type: Number,
    required: true,
  },
  cartItems: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      weight: { type: Number, required: true },
      price: { type: Number, required: true },
      image:{type:String},
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  deliveryAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: { type: String, enum: ["stripe", "cash"], required: true },
  paymentIntentId: { type: String }, // only for Stripe
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  deliveryDate: {
    type: Date,
  },
});
// get order by user
app.get("/GetOrders", ValidateUser, async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.id }).sort({
      orderDate: -1,
    });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
//getAll orders (admin)
app.get("/GetAllOrders", async (req, res) => {
  try {
    const orders = await Orders.find().sort({ orderDate: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
// get 5 to 10 orders (admin)
app.get("/getLimitOrders",async(req,res)=>{
  try {
    const orders = await Orders.find().sort({ orderDate: -1 }).limit(3);
    res.status(200).json({success:true,orders});
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, error: "Internal server error" });    
  }
})

app.get("/SeafoodStats", async (req, res) => {
  try {
    const stats = await Orders.aggregate([
      { $unwind: "$cartItems" }, 
      {
        $group: {
          _id: "$cartItems.name", 
          totalOrdered: { $sum: "$cartItems.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id", 
          count: "$totalOrdered",
        },
      },
    ]);

    res.status(200).json({ success: true, seafoodStats: stats });
  } catch (error) {
    console.error("Error fetching seafood stats:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Create order
app.post("/PlaceOrder", ValidateUser, async (req, res) => {
  try {
    const {
      cartItems,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      paymentIntentId,
    } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.postalCode ||
      !deliveryAddress.country
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Delivery address is required" });
    }
    const userId = req.user.id;
      const countryMap = {
        Tunisie: "TN",
        France: "FR",
        Germany: "DE",
        Italy: "IT",
        Spain: "ES",
        Portugal: "PT",
        Belgium: "BE",
        Netherlands: "NL",
        Luxembourg: "LU",
        Switzerland: "CH",
        Austria: "AT",
        Greece: "GR",
        Cyprus: "CY",
        Malta: "MT",
        Croatia: "HR",
        Slovenia: "SI",
        Bulgaria: "BG",
        Romania: "RO",
        Hungary: "HU",
        Poland: "PL",
        Czechia: "CZ",
        Slovakia: "SK",
        Denmark: "DK",
        Sweden: "SE",
        Finland: "FI",
        Norway: "NO",
        Iceland: "IS",
        Ireland: "IE",
        UnitedKingdom: "GB",
      };
  deliveryAddress.country = countryMap[deliveryAddress.country] || deliveryAddress.country;
    if (paymentMethod === "stripe") {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );  
    }
    const newOrder = new Orders({
      userId: req.user.id,
      cartItems,
      totalPrice,
      deliveryAddress,
      paymentMethod,
      paymentIntentId,
      paymentStatus:  paymentMethod === "stripe" ? "paid" : "pending", 
    });
    const savedOrder= await newOrder.save();
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
// create payment intent
app.post("/createPaymentIntent",ValidateUser, async (req, res) => {
  try {
    const { totalPrice } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPrice * 100),
      currency: "eur",
      payment_method_types: ["card"],
    });
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// Get stripe payment details
app.get("/stripePayments", async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({ limit: 100});
    const summary = payments.data.reduce((acc, pi) => {
      const method = pi.payment_method_types[0];
      acc[method] = acc[method] || 0;
      acc[method] += pi.amount_received / 100; 
      return acc;
    }, {});
    res.json({ success: true, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Stripe fetch failed" });
  }
});
// get payment details (card & cash)
app.get("/paymentDetails", async (req, res) => {
  try {
    const orders = await Orders.find();
    const summary = orders.reduce(
      (acc, order) => {
        const method = order.paymentMethod;
        acc[method] = acc[method] || 0;
        acc[method] += order.totalPrice;
        return acc;
      },
      { card: 0, cash: 0 }
    );
    res.json({ success: true, summary });
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Payment fetch failed" });
  }
});
// Number of seaFood has been Ordered in a specific period
app.get("/MostOrderedSeafood", async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    const stats = await Orders.aggregate([
      {
        $match: {
          orderDate: { $gte: start, $lte: end },
        },
      },
      { $unwind: "$cartItems" },
      {
        $group: {
          _id: "$cartItems.name",
          totalOrdered: { $sum: "$cartItems.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          count: "$totalOrdered",
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.status(200).json({ success: true, mostOrdered: stats });
  } catch (error) {
    console.error("Error fetching most ordered seafood:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// PORT
app.listen(port, (error) => {
  if (!error) {
    console.log("Server Running on Port " + port);
  } else {
    console.log("Error: " + error);
  }
});
