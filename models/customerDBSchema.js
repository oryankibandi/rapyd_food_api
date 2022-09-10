const mongoose = require("mongoose");
const { Schema } = mongoose;

const customerSchema = new Schema({
  customer_id: { type: String, required: true },
  delinquent: { type: String, required: false },
  discount: { type: String, required: false },
  name: { type: String, required: true },
  default_payment_method: {
    type: String,
    required: false,
    default: "",
  },
  description: { type: String, required: false, default: "" },
  phone_number: { type: String, required: true },
  subscriptions: { type: String, required: false, default: null },
  created_at: { type: Date, required: true, default: Date.now },
});

module.exports = mongoose.model("Customer", customerSchema);
