require('dotenv').config()
const express = require("express");
const app = express();
var cors = require("cors");

// Server settings
app.use(cors());
app.use(express.json());

// Contollers
var restaurantController = require("./controllers/restaurantController")
var activityController = require("./controllers/activityController")
var hotelController = require("./controllers/hotelControllerApi")
var drinkController = require("./controllers/drinkController")
var eatController = require("./controllers/eatController")

// Routes
app.get("/", (req, res) => res.send("ok"))
app.use("/api/restaurants", restaurantController);
app.use("/api/activities", activityController);
app.use("/api/hotels", hotelController);
app.use("/api/drinks", drinkController);
app.use("/api/eats", eatController);

// Start server on port 7000
app.listen(7000, () => console.log("Server is running"));

module.exports = app;
