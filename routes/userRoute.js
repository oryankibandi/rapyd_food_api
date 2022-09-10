const express = require("express");
const {
  registerUser,
  logInUser,
  logOut,
  refreshToken,
} = require("../controllers/userController");

let router = express.Router();

router.route("/login").post(logInUser);

router.route("/register").post(registerUser);

router.route("/logout").post(logOut);

router.route("/refresh").get(refreshToken);

module.exports = router;
