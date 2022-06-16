const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  items: Object,
  muffinDiscount: Boolean,
  totalInfo: Object,
  cash: String,
  change: String,
  receipt: [String],
});

const History = mongoose.model("History", HistorySchema);

module.exports = History;