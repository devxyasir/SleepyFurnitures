const User = require("../models/userData");
const jwt = require("jsonwebtoken");
const { checkEmailHost, sendMessageToUserEmail } = require("./sendMailToUsers");
const CustomErrorHandler = require("../errors/customErrorHandler");
const bcryptjs = require("bcryptjs");

const generateToken = (email, verificationStatus, expiryDate) => {
  let token = jwt.sign({ email, verificationStatus }, process.env.SECRET_TOKEN_KEY, { expiresIn: expiryDate });
  return token;
};

// Verify user's account
const emailVerificationMessageDatas = (emailVerificationToken) => {
  const mailUser = process.env.MAIL_FOR_SENDING;
  const mailPass = process.env.MAIL_PASS;
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";
  return {
    port: 587,
    secure: false,
    user: mailUser,
    pass: mailPass,
    subject: "[Auffur] Please confirm your email address",
    text: `Please click this link or paste the link in your browser to verify your email address: ${serverUrl}/api/v1/verifyGmail/Email-verification?token=${emailVerificationToken}`,
    html: `<h2>Verify your email address </h2><br/><div>To complete your account registration, please verify that this is your email address by clicking the button below</div><br/> <a href="${serverUrl}/api/v1/auth/verifyGmail/Email-verification?token=${emailVerificationToken}" style="display: inline-block; padding: 0.5em 1em; background-color: #fca311; color: white; text-decoration: none;">Verify Email</a> <br /> <br /> <br /> <div>This link will expire in 5 days. If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</div> <br /> <span>Thanks,</span> <br /> <span>Auffur Team</span>`,
  };
};

// Register
const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const email = req.body?.email?.toLowerCase();

  let checkIfEmailExists = await User.findOne({ email });
  let token = generateToken(email, "pending", "5d");
  const hashedpassword = await bcryptjs.hash(password, 10);

  if (checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Email has already been registered by another user");
  } else if (!checkEmailHost(email)) {
    throw new CustomErrorHandler(400, "Email host not supported");
  }
  
  // Create the new user with the hashed password and initial verification status
  await User.create({
    email,
    username,
    password: hashedpassword,
    verificationStatus: "verified", // Setting status to verified by default for guest access
    verificationToken: token,
  });

  const response = await sendMessageToUserEmail(email, token, emailVerificationMessageDatas);

  res.send(
    "Your account has been created! A verification link has been sent to your email. Please check your email to complete your registration."
  );
};

// LOGIN
const loginUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body?.email?.toLowerCase();

  let checkIfEmailExists = await User.findOne({ email }).lean();

  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(400, "Incorrect email or password");
  } else if (checkIfEmailExists && checkIfEmailExists.verificationStatus === "pending") {
    throw new CustomErrorHandler(403, "User Email address must be verified before login");
  } else if (checkIfEmailExists && !(await bcryptjs.compare(password, checkIfEmailExists.password))) {
    throw new CustomErrorHandler(400, "Incorrect email or password");
  } else if (checkIfEmailExists && (await bcryptjs.compare(password, checkIfEmailExists.password))) {
    let loginToken = generateToken(email, "verified", "30d");

    await User.findByIdAndUpdate({ _id: checkIfEmailExists._id }, { verificationToken: loginToken });

    res.json({
      message: "You have successfully logged in",
      userData: { ...checkIfEmailExists, loginToken },
    });
  }
};

// Guest User: Skip login for guest access (auto-login as guest)
const guestLogin = (req, res) => {
  // Simulating a guest login by creating a temporary token
  const guestToken = generateToken("guest@example.com", "guest", "1h"); // 1 hour expiry for guest access

  res.json({
    message: "You are logged in as a guest.",
    userData: {
      email: "guest@example.com",
      username: "Guest",
      verificationStatus: "guest",
      loginToken: guestToken,
    },
  });
};

// DELETE USERS
const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new CustomErrorHandler(401, "Parameters missing");
  }
  const user = await User.findByIdAndDelete(id);

  res.status(201).json({});
};

module.exports = { registerUser, loginUser, generateToken, emailVerificationMessageDatas, deleteUser, guestLogin };
