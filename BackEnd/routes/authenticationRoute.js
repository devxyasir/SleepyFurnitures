const express = require("express");
const { registerUser, loginUser, deleteUser } = require("../controllers/userAuthentication");
const handleEmailLinkClick = require("../middleware/handleEmailLinkClick");
const { handleForgotPasswordClick, changePassword } = require("../controllers/password");
const isTokenvalid = require("../controllers/isTokenValid");
const resendEmailVerification = require("../controllers/resendEmailVerification");
const { checkIfUserIsAnAdminMiddleware } = require("../middleware/adminAuthorisation.js");
const postUserOrders = require("../controllers/Orders"); // Add order controller

const router = express.Router();

 

// Guest access route: Place an order without login (order is guest-based or user-based after login)
router.route("/orders/placeOrders").post(postUserOrders);

// User authentication routes
router.route("/verifyGmail/:task").get(handleEmailLinkClick); // Email verification link click
router.route("/isTokenValid").get(isTokenvalid); // Token validation route
router.route("/register").post(registerUser); // User registration
router.route("/login").post(loginUser); // User login
router.route("/resetPasswordLink/:task").get(handleEmailLinkClick); // Reset password link click
router.route("/changePassword").post(changePassword); // Change password
router.route("/forgotPasswordClick").post(handleForgotPasswordClick); // Forgot password
router.route("/resendEmailVerificationLink").post(resendEmailVerification); // Resend email verification
router.route("/deleteUser").delete(checkIfUserIsAnAdminMiddleware, deleteUser); // Admin route to delete user

module.exports = router;
