const express = require("express");
const router = express.Router();
const fs = require("fs");
const productController = require("../controllers/product");

var multer = require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

router.post(
  "/create-product",
  upload.single("productImage"),
  productController.createProduct
);

router.get("/get-product", productController.getProduct);

router.get("/get-product/:productId", productController.getProductById);

router.put(
  "/update-product/:productId",
  upload.single("productImage"),
  productController.updateProductById
);

router.delete(
  "/delete-product/:productId",
  productController.deleteProductById
);

module.exports = router;
