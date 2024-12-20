const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize the MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Define the product schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    discountPercent: {
      type: Number,
      default: 0, // Discount is optional, default to 0 if not provided
    },
    image: {
      type: String, // This will store the URL of the uploaded image
      required: true,
    },
    productType: {
      type: String,
      enum: ["Bed", "Mattress"], // You can add more types as needed
      required: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);
 
// Create a model from the schema
const Product = mongoose.model("Product", productSchema);

// Initialize a new product object
const newProduct = new Product({
  title: "Luxury Mattress",
  price: 299.99,
  stock: 100,
  discountPercent: 10, // Optional
  image: "https://res.cloudinary.com/difzkvlbn/image/upload/v1734691990/file-Auffur/tmp-1-1734691988075_yz7ayq.png", // Example image URL
  productType: "Mattress",
});

// Save the product to the database
newProduct
  .save()
  .then((savedProduct) => {
    console.log("Product saved successfully:", savedProduct);
  })
  .catch((error) => {
    console.error("Error saving product:", error);
  });
