require('dotenv').config()
const express = require("express");
const app = express();
var cors = require("cors");

// Server settings
app.use(cors());
app.use(express.json());

// Contollers
var restaurantcontroller = require("./controllers/restaurantcontroller")

// Routes
app.get("/", (req, res) => res.send("ok"))
app.use("/api/restaurants", restaurantcontroller);

// Start server on port 7000
app.listen(7000, () => console.log("Server is running"));

module.exports = app;