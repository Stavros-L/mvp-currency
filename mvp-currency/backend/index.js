require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const currencyPairRoutes = require("./routes/currencyPair");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use("/api/currency-pairs", currencyPairRoutes);

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
});
