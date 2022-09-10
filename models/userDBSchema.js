const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone_number: { type: String, required: true },
  country: { type: String, required: true, default: "IN" },
  business_vat_id: { type: String, required: true },
  ewallet_id: { type: String, required: true },
  cus_id: { type: String, required: true },
  password: { type: String, required: true },
  refreshToken: { type: String, required: false, default: null },
});

module.exports = mongoose.model("User", userSchema);
