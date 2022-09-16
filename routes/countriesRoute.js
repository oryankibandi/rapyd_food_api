const express = require("express");
const { getSupportedCountries } = require("../controllers/countriesController");

let router = express.Router();

router.route("/").get(getSupportedCountries);

module.exports = router;
