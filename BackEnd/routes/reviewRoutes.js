const express = require("express");
const { getAllReviews, createReview } = require("../controllers/reviewController");

const router = express.Router();

router.route("/")
  .get(getAllReviews)  // GET /api/v1/reviews
  .post(createReview); // POST /api/v1/reviews

module.exports = router;
