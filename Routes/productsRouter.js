const Router = require("express").Router();
const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, "product-" + Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create a new product
Router.post("/", upload.array("image"), async (req, res) => {
  try {
    const data = await Product.create({
      title: req.body.title,
      description: req.body.description,
      images: req.files.map((file) => file.filename),
      price: req.body.price,
      size: req.body.size,
      colour: req.body.colour,
      buyButton: req.body.buyButton,
    });
    res.status(201).send(data);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

// Get all products
Router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.send({ count: products.length, data: products });
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a single product
Router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Update a product
Router.patch("/:id", upload.array("image"), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "title",
    "description",
    "image",
    "price",
    "size",
    "colour",
    "buyButton",
  ];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    updates.forEach((update) => (product[update] = req.body[update]));
    if (req.file) {
      product.image = req.file.path;
    }
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Delete a product
Router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    // Delete the images from the upload folder
    product.images.forEach((filename) => {
      const imagePath = path.join(__dirname, "..", "public","uploads", filename);
      fs.unlinkSync(imagePath);
    });

    if (!product) {
      return res.status(404).send();
    }
    res.json({ Message: "Deleted Successfully", __id: req.params.id });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = Router;
