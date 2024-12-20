const mongoose = require("mongoose");

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

module.exports  = mongoose.model("Product", productSchema);


