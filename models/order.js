const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  table: String,
  noOfCustomers: String,
  customerNames: String,
  items: Object,
  muffinDiscount: Boolean,
  totalInfo: Object,
  cash: String,
  change: String,
  receipt: [String],
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;