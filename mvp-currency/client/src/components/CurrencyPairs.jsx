import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CurrencyPairs.css";

// const API_URL = process.env.REACT_API_URL;
const API_URL = "http://localhost:5000";




const CurrencyPairs = () => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [currencyPairs, setCurrencyPairs] = useState([]);

  useEffect(() => {
    // Load currency pairs from the database when the component mounts
    loadCurrencyPairs();
  }, []);

  const loadCurrencyPairs = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/currency-pairs/load`);
      const pairsWithRates = await Promise.all(
        response.data.map(async (pair) => {
          // Fetch conversion rate and last update time for each pair in the backend
          const rateResponse = await axios.get(`${API_URL}/api/currency-pairs/rates/${pair.from}/${pair.to}`);
          const { conversion_rate, time_last_update_utc } = rateResponse.data;

          // Combine the fetched data with the existing pair data using Object.assign
          return Object.assign({}, pair, {
            conversion_rate,
            time_last_update_utc,
          });
        })
      );

      setCurrencyPairs(pairsWithRates);
    } catch (error) {
      console.error("Error loading currency pairs:", error.message);
    //  console.log("API URL:", process.env.REACT_API_URL);
    }
  };

  const saveCurrencyPair = async () => {
    try {
      // Update the endpoint to /api/currency-pairs/create
      await axios.post(`${API_URL}/api/currency-pairs/create`, { from, to });
      // Refresh the list of currency pairs after creating
      loadCurrencyPairs();
    } catch (error) {
      console.error("Error creating currency pair:", error.message);
    //  console.log("API URL:", process.env.REACT_API_URL);
    }
  };

  const deleteCurrencyPair = async (pairId) => {
    try {
        await axios.delete(`${API_URL}/api/currency-pairs/delete/${pairId}`);
        // Refresh the list of currency pairs after deleting
      loadCurrencyPairs();
    } catch (error) {
      console.error("Error deleting currency pair:", error.message);
    }
  };

  // ascii art title rendered from https://fsymbols.com/text-art/
  return (
    <div>
      {/* input form */}

      <div className ="top">
      <div className ="title">

<h6>

<br />█▀▀ █▀█ █▄░█ █░█ █▀▀ █▀█ █▀ █ █▀█ █▄░█   █▀█ ▄▀█ ▀█▀ █▀▀ █▀   █░░ █ █▀ ▀█▀
<br />█▄▄ █▄█ █░▀█ ▀▄▀ ██▄ █▀▄ ▄█ █ █▄█ █░▀█   █▀▄ █▀█ ░█░ ██▄ ▄█   █▄▄ █ ▄█ ░█░

</h6>


</div>
      </div>

      <div className="inputForm">
       From:  <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} />
       To:  <input type="text" value={to} onChange={(e) => setTo(e.target.value)} />
        <button onClick={saveCurrencyPair}>Add Pair</button>
        <p><a href="https://www.exchangerate-api.com">Rates By Exchange Rate API</a>
        <br />
        </p>
        <p>
        Supports <b>ISO 4217</b> Three Letter Currency Codes
        <br/>
        e.g. USD, EUR, GBP, JPY

        <br/>
        <a href="https://en.wikipedia.org/wiki/ISO_4217">More info here</a>
        </p>

      </div>

<div className="Flexfield" >
      {/* Display currency pairs with rates and last update time */}
      {currencyPairs.map((pair) => (
        <div key={pair._id} className="Flexbox">
          <p>{`${pair.from} => ${pair.to}`}</p>
          <p>{`Conversion Rate: ${pair.conversion_rate}`}</p>
          <p>{`Latest Update: ${pair.time_last_update_utc}`}</p>
          <button onClick={() => deleteCurrencyPair(pair._id)}>Delete Pair</button>
        </div>
      ))}
      </div>
    </div>
  );
};

export default CurrencyPairs;
