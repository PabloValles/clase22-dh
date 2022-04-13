const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => res.render("products", { products }),

  // Detail - Detail from one product
  detail: (req, res) => {
    let product = products.find((item) => item.id == req.params.id);

    let finalPrice = 0;

    if (product.discount > 0) {
      let descuento = Math.floor(product.price * product.discount) / 100;
      finalPrice = product.price - descuento;
    } else {
      finalPrice = product.price;
    }

    res.render("detail", { product: product, finalPrice });
  },

  // Create - Form to create
  create: (req, res) => res.render("product-create-form"),

  // Create -  Method to store
  store: (req, res) => {
    let id = products[products.length - 1].id + 1;

    let newProduct = {
      id,
      ...req.body,
      image: "default-image.png",
    };

    products.push(newProduct);

    fs.writeFileSync(productsFilePath, JSON.stringify(products), "utf-8");

    res.redirect("../products");
  },

  // Update - Form to edit
  edit: (req, res) => {
    let product = products.find((item) => item.id == req.params.id);
    res.render("product-edit-form", { product });
  },
  // Update - Method to update
  update: (req, res) => {
    let id = parseInt(req.params.id);
    let product = products.find((item) => item.id == id);

    let editProduct = {
      id: parseInt(req.params.id),
      ...req.body,
      image: product.image,
    };

    products[id - 1] = editProduct;

    res.redirect("/products/edit/" + editProduct.id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    let id = parseInt(req.params.id);
    let product = products.find((item) => item.id == id);

    let newProducts = products.filter((product) => product.id != id);
    fs.writeFileSync(productsFilePath, JSON.stringify(newProducts), "utf-8");

    res.redirect("/");
  },
};

module.exports = controller;
