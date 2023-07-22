const fs = require("fs");

// XXXXXXXXXXXXXXXX CREATE PRODUCT XXXXXXXXXXXX

const createProduct = async function (req, res) {
  var obj = {
    table: [],
  };
  try {
    createData = {};
    const productId = Math.floor(100000 + Math.random() * 900000);
    createData.productId = productId;
    if (!req.body.productName) {
      return res.status(404).send({
        status: "error",
        message: "Product name required",
      });
    }
    createData.productName = req.body.productName;
    if (!req.body.description) {
      return res.status(404).send({
        status: "error",
        message: "Description  required",
      });
    }
    createData.description = req.body.description;

    createData.isActive = true;

    fs.exists("product.json", function (exists) {
      if (exists) {
        console.log("yes file exists");
        fs.readFile("product.json", function readFileCallback(err, data) {
          if (err) {
            console.log(err);
          } else {
            obj = JSON.parse(data);
            obj.table.push(createData);
            let json = JSON.stringify(obj);
            fs.writeFile("product.json", json, () => {
              return res.status(201).send({
                status: "success",
                message: "Product created successfully",
              });
            });
          }
        });
      } else {
        console.log("file not exists");
        obj.table.push(createData);
        let json = JSON.stringify(obj);
        fs.writeFile("product.json", json, () => {
          return res.status(201).send({
            status: "success",
            message: "Product created successfully",
          });
        });
      }
    });
  } catch (err) {
    res.status(500).send({
      msg: "Please try again later",
    });
  }
};

// ===========   [ Get All Active Product Data] ===============

const getProduct = async function (req, res) {
  try {
    var obj;
    fs.readFile("product.json", "utf8", function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      const table = obj.table;
      const arr = [];
      for (let index = 0; index < table.length; index++) {
        if (table[index].isActive == false) {
          continue;
        } else {
          arr.push(table[index]);
        }
      }
      return res.status(200).send({
        status: "success",
        count: arr.length,
        data: arr,
      });
    });
  } catch (err) {
    res.status(500).send({
      msg: "Please try again later",
    });
  }
};

//                  [ Get product By Id]

const getProductById = async function (req, res) {
  try {
    if (!req.params.productId) {
      return res.status(400).send({
        status: "error",
        message: "Product id required",
      });
    }
    var obj;
    fs.readFile("product.json", "utf8", function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      const table = obj.table;
      for (let index = 0; index < table.length; index++) {
        if (table[index].productId == req.params.productId) {
          return res.status(200).send({
            status: "success",
            data: table[index],
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "No Data found",
          });
        }
      }
    });
  } catch (err) {
    res.status(500).send({
      msg: "Please try again later",
    });
  }
};

//                  [ Update product By Id]

const updateProductById = async function (req, res) {
  try {
    if (!req.params.productId) {
      return res.status(400).send({
        status: "error",
        message: "Product id required",
      });
    }
    const updateData = {};

    var obj;
    fs.readFile("product.json", "utf8", function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      const table = obj.table;
      for (let index = 0; index < table.length; index++) {
        if (table[index].productId == req.params.productId) {
          updateData.productId = req.params.productId;
          if (req.body.productName) {
            updateData.productName = req.body.productName;
          } else {
            updateData.productName = table[index].productName;
          }

          if (req.body.description) {
            updateData.description = req.body.description;
          } else {
            updateData.description = table[index].description;
          }
          if (req.body.isActive) {
            updateData.isActive = req.body.isActive;
          } else {
            updateData.isActive = table[index].isActive;
          }
          obj.table[index] = updateData;
          const json = JSON.stringify(obj);
          fs.writeFile("product.json", json, () => {
            return res.status(201).send({
              status: "success",
              message: "Product update successfully",
            });
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "No Data found",
          });
        }
      }
    });
  } catch (err) {
    res.status(500).send({
      msg: "Please try again later",
    });
  }
};

//                  [ Delete product By Id]

const deleteProductById = async function (req, res) {
  try {
    if (!req.params.productId) {
      return res.status(400).send({
        status: "error",
        message: "Product id required",
      });
    }

    var obj;

    fs.readFile("product.json", "utf8", function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      const table = obj.table;
      for (let index = 0; index < table.length; index++) {
        if (table[index].productId == req.params.productId) {
          delete obj.table[index];
          obj = obj.table.filter(() => {
            return true;
          });
          var data2 = {
            table: obj,
          };
          const json = JSON.stringify(data2);
          fs.writeFile("product.json", json, () => {
            return res.status(200).send({
              status: "success",
              message: "Product Deleted successfully",
            });
          });
        } else {
          return res.status(200).send({
            status: "success",
            message: "No Data found",
          });
        }
      }
    });
  } catch (err) {
    res.status(500).send({
      msg: "Please try again later",
    });
  }
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
