const express = require("express");
const {
  listPaymentByCountry,
  createCardPayment,
} = require("../controllers/paymentController");

let router = express.Router();

router.route("/listPaymentByCountry").get(listPaymentByCountry);

router.route("/card").post(createCardPayment);

module.exports = router;
