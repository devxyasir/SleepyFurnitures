const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/userData"); // Replace with the correct path to your User model
const Admin = require("./models/admin"); // Replace with the correct path to your Admin model

const assignAdminRole = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      "mongodb+srv://JHpRv89n2ml6gxns:JHpRv89n2ml6gxns@cluster0.e9lk1.mongodb.net/test",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Check if the user already exists
    const email = "admin@admin.com"; // Replace with the user's email
    let user = await User.findOne({ email });

    if (!user) {
      // If user doesn't exist, create the user
      const hashedPassword = await bcrypt.hash("password123", 10); // Replace with the actual password
      user = new User({
        username: "admin", // Replace with desired username
        email: email,
        password: hashedPassword,
        adminStatus: true, // Mark as admin
        verificationStatus: "verified", // Update verification status
        address: "123 Main Street",
        country: "USA",
        postalCode: 12345,
        city: "New York",
        shippingMethod: "standard",
      });

      await user.save();
      console.log("User created successfully:", user);
    }

    // Check if admin entry already exists for the user
    let admin = await Admin.findOne({ userData: user._id });

    if (!admin) {
      // If admin entry doesn't exist, create it
      admin = new Admin({
        userData: user._id,
        adminRank: 1, // Assign a rank (e.g., 1, 2, or 3)
        lastLogin: new Date(),
      });

      await admin.save();
      console.log("Admin role assigned successfully:", admin);
    } else {
      console.log("Admin role already assigned to this user.");
    }

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error assigning admin role:", error);
  }
};

// Run the function
assignAdminRole();
