const express = require("express");
const router = express.Router();
const axios = require("axios");

const CurrencyPair = require("../models/CurrencyPairSchema.js");

require("dotenv").config(); // Load environment variables from .env file

// Route to load all pairs
router.get("/load", async (req, res) => {
    try {
      const currencyPairs = await CurrencyPair.find();
      res.json(currencyPairs);
    } catch (error) {
      console.error("Error loading currency pairs:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });


// Route to create a new currency pair
router.post("/create", async (req, res) => {
    const { from, to } = req.body;
  
    try {
      // Check if the pair already exists
      const existingPair = await CurrencyPair.findOne({ from, to });
      if (existingPair) {
        console.log(`Currency pair ${from} => ${to} already exists`);        
        return res.status(400).json({ message: "Currency pair already exists" });
      }
  
      // Create a new pair
      const newPair = new CurrencyPair({ from, to });
      await newPair.save();
      console.log(`Currency pair ${from} => ${to} created successfully`);
      res.status(201).json({ message: "Currency pair created successfully", pair: newPair });
    } catch (error) {
      console.error("Error creating currency pair:", error.message);
      res.status(500).json({ message: error.message });
    }
  });



// Route to delete a currency pair by ID
router.delete("/delete/:pairId", async (req, res) => {
  try {
    const deletedPair = await CurrencyPair.findByIdAndDelete(req.params.pairId);
    if (!deletedPair) {
      return res.status(404).json({ message: "Currency pair not found" });
    }
    console.log(`Currency pair ${deletedPair.from} => ${deletedPair.to} deleted successfully`);
    res.json({ message: "Currency pair deleted successfully" });
  } catch (error) {
    console.error("Error deleting currency pair:", error.message);
    res.status(500).json({ message: error.message });
  }
});


// Route to get conversion rate and last update time from API
router.get("/rates/:from/:to", async (req, res) => {
  let { from, to } = req.params;

  from = from.toUpperCase();
  to = to.toUpperCase();



  try {
    const rateResponse = await axios.get(`https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`);
    console.log("API URL:", process.env.EXCHANGE_RATE_API_KEY);
    console.log("from:", from);
    console.log("to :", to);
    console.log("test:", rateResponse);
    console.log("API URL:", `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_RATE_API_KEY}/pair/${from}/${to}`);
    const { conversion_rate, time_last_update_utc } = rateResponse.data;

    res.json({ conversion_rate, time_last_update_utc });
  } catch (error) {
    console.error("Error fetching rates:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});








module.exports = router;
