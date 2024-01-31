const mongoose = require("mongoose");

const currencyPairSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("CurrencyPair", currencyPairSchema);
