const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Product = require("../models/products");

const postUserOrders = async (req, res) => {
  const { orderDetails } = req.body;
  const { products } = orderDetails;
  const email = req.body?.orderDetails?.email?.toLowerCase();

  let isOrderAboveLimit = false;

  // Check if the order exceeds the available stock for any product
  for (let key of products) {
    const findProduct = await Product.findById(key.productId);
    if (!findProduct) {
      throw new CustomErrorHandler(404, `Product with ID ${key.productId} not found`);
    }
    if (key.quantity > findProduct.stock) {
      isOrderAboveLimit = true;
      break; // No need to check further if one product exceeds the stock limit
    }
  }

  // Check if the email exists
  let checkIfEmailExists = await User.findOne({ email });
  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(403, "Email address associated with the account must be used");
  } else if (isOrderAboveLimit) {
    throw new CustomErrorHandler(403, "One or more product quantities selected are more than the amount in stock");
  } else {
    // Add the order details to the user's orders
    await User.findOneAndUpdate({ email }, { $push: { orders: orderDetails } }, { new: true });

    // Update the stock for each product in the order
    for (let key of products) {
      const findProduct = await Product.findById(key.productId);
      let newStock = findProduct.stock - key.quantity;
      // Update new stock
      await findProduct.updateOne({ stock: newStock });
    }

    res.status(201).send("Order successful");
  }
};

module.exports = postUserOrders;
