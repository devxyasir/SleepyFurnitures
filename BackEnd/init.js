const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // To hash the password
const User = require("./models/userData"); // Replace with the correct path to your user model

const initializeUser = async () => {
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

    // Hash the password
    const hashedPassword = await bcrypt.hash("password123", 10); // Replace with the actual password

    // Create a user object
    const user = new User({
      username: "admin", // Replace with desired username
      email: "admin@admin.com", // Replace with desired email
      password: hashedPassword,
      adminStatus: false, // Default to non-admin
      verificationStatus: "pending", // Default status
      address: "123 Main Street",
      country: "USA",
      postalCode: 12345,
      city: "New York",
      shippingMethod: "standard", // Default shipping method
      orders: [
        {
          products: [
            { productId: "60d0fe4f5311236168a109ca", quantity: 2 }, // Replace with valid product ID and quantity
          ],
          username: "admin",
          shippingMethod: "standard",
          email: "admin@admin.com",
          address: "123 Main Street",
          country: "USA",
          postalCode: 12345,
          city: "New York",
          totalAmount: 100.0, // Replace with order total
          deliveryStatus: "pending", // Initial delivery status
          paymentStatus: "pending", // Initial payment status
        },
      ],
    });

    // Save the user to the database
    const result = await user.save();
    console.log("User created successfully:", result);

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// Run the initialization function
initializeUser();
