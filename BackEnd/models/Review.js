const mongoose = require('mongoose');

// Define the review schema
const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
});

// Create and export the Review model
module.exports = mongoose.model('Review', reviewSchema);
