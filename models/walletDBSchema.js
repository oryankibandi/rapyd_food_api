const mongoose = require("mongoose");
const { Schema } = mongoose;

const walletSchema = new Schema({
  wallet_id: { type: String, required: true },
  status: { type: String, required: true },
  verification_status: { type: String, required: true },
  type: { type: String, required: true },
  metadata: { type: Object, required: true },
  ewallet_reference_id: { type: String, required: true },
  category: { type: String, required: false, default: null },
});

module.exports = mongoose.model("Wallet", walletSchema);
