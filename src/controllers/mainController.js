const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  index: (req, res) => {
    let productos = JSON.parse(fs.readFileSync(productsFilePath));

    res.render("index", { products: productos });
  },
  search: (req, res) => {
    let busqueda = req.query.keywords;

    let findProducts = products.filter((p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase().trim())
    );

    res.render("results", { products: findProducts, busqueda, toThousand });
  },
};

module.exports = controller;
