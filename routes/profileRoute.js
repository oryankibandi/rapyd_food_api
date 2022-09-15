const express = require("express");
const { getUserProfile } = require("../controllers/profileController");

let router = express.Router();

router.route("/:cus_id").get(getUserProfile);

module.exports = router;
