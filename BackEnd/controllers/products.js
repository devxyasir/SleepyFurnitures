const Product = require("../models/products");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const CustomErrorHandler = require("../errors/customErrorHandler");

// Create a new product
const createProducts = async (req, res) => {
  try {
    // Destructure data from the request body
    const { title, price, stock, discountPercent, image, productType } = req.body;
    console.log(req.body)
    // Handle single image upload
    // const image = req.files?.image;  // Only one image expected here

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required." });
    }
    if (!price) {
      return res.status(400).json({ message: "Price is required." });
    }
    if (!stock) {
      return res.status(400).json({ message: "Stock is required." });
    }
    if (!image) {
      return res.status(400).json({ message: "Image is required." });
    }
    if (!productType) {
      return res.status(400).json({ message: "Product Type is required." });
    }

    // // Upload the image to Cloudinary
    // const result = await cloudinary.uploader.upload(image.tempFilePath, {
    //   use_filename: true,
    //   folder: "file-Auffur",
    // });

    // Create a new product using the Product model
    const product = new Product({
      title,
      price,
      stock,
      discountPercent,
      image,  // Store the secure URL of the uploaded image
      productType,
    });

    // Save the product to the database
    const savedProduct = await product.save();

    // Return a success response
    res.status(201).json({
      message: "Product created successfully",
      product: savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};



// Get all products
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(200).json({ message: "success", products });
};

// Upload product images to Cloudinary
const uploadProductImages = async (req, res) => {
  if (!req.files.image.mimetype.includes("image")) {
    throw CustomErrorHandler(415, "invalid image type");
  }
  if (!req.files) {
    throw CustomErrorHandler(400, "No image was uploaded");
  }
  if (req.files.image.size > 3 * 1024 * 1024) {
    throw CustomErrorHandler(400, "Image size has exceeded the limit");
  }

  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-Auffur",
  });
  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(201).json({ image: { src: result.secure_url } });
};

// Get a specific product
const getAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  const product = await Product.findById(id).select({
    _id: 1,
    title: 1,
    stock: 1,
    price: 1,
    discountPercentValue: 1,
    categories: 1,
    image: 1,
  });

  if (!product) {
    throw new CustomErrorHandler(404, "Product not found");
  }

  res.status(200).json({ message: "success", product });
};

// Delete a specific product
const deleteAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new CustomErrorHandler(404, "Product not found");
  }

  res.status(201).json({ message: "success", product });
};

// Update a specific product
const updateAspecificProduct = async (req, res) => {
  const updatedData = req.body;
  const { id } = req.params;

  if (!id || !updatedData) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    message: "Product successfully updated",
    product: updatedProduct,
  });
};

// Search for products
const searchProducts = async (req, res) => {
  const { title, pageNo, perPage } = req.query;

  if (!title || !pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  const searchLength = await Product.countDocuments({
    title: { $regex: title, $options: "i" },
  });

  const searchedProducts = await Product.find({
    title: { $regex: title, $options: "i" },
  })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);

  res.status(201).json({ products: searchedProducts, productsLength: searchLength });
};

// Sort products by low stock
const sortByLowStockProducts = async (req, res) => {
  const { pageNo, perPage } = req.query;

  if (!pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  const productsLength = await Product.countDocuments();
  const sortedProducts = await Product.find({})
    .sort({ stock: 1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);

  res.status(201).json({ products: sortedProducts, productsLength });
};

module.exports = {
  getAllProducts,
  createProducts,
  uploadProductImages,
  getAspecificProduct,
  deleteAspecificProduct,
  updateAspecificProduct,
  searchProducts,
  sortByLowStockProducts,
};
