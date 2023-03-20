const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: [String],
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  colour: {
    type: String,
    required: true,
  },
  buyButton: {
    type: String,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
