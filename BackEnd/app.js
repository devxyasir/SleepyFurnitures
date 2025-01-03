const express = require("express");
require("dotenv").config();
require("express-async-errors");
const connectDb = require("./db/connect");
const errorHandler = require("./middleware/errorHandler");
const pathNotFound = require("./middleware/pathNotFound");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authenticationRoute");
const adminRoute = require("./routes/adminRoutes");
const ordersRoute = require("./routes/ordersRoute");
const reviewRoute = require("./routes/reviewRoutes");
const { clearAdminJwt } = require("./controllers/admin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

// middlewares
app.use(cors({
  origin:"http://localhost:3000"
}));
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).send("<h1>Auffur, Ecommerce Server</h1>");
});

app.use("/api/v1/products", productRoute);
app.use("/api/v1/auth", authRoute);
app.use("/orders", ordersRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/reviews", reviewRoute);
app.use(errorHandler);
app.use(pathNotFound);

// Clear admin token after 6 hours of inactivity
setInterval(clearAdminJwt, 6 * 60 * 60 * 1000);  // Every 6 hours

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);  // Connect to the database
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
};
  
startServer();


