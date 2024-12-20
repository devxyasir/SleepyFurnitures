const Review = require("../models/Review");

// Get all reviews
const getAllReviews = async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, reviews });
};

// Create a new review
const createReview = async (req, res) => {
  const { name, review, rating } = req.body;

  if (!name || !review || !rating) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  const newReview = await Review.create({ name, review, rating });
  res.status(201).json({ success: true, review: newReview });
};

module.exports = {
  getAllReviews,
  createReview,
};
