require('dotenv').config()
const express = require("express");
const app = express();
var cors = require("cors");
var sequelize = require("./database");

// Server settings
app.use(cors());
app.use(express.json());

// Contollers
var authcontroller = require("./controllers/authController");
var restaurantController = require("./controllers/restaurantController")
var activityController = require("./controllers/activityController")
var hotelController = require("./controllers/hotelControllerApi")
var drinkController = require("./controllers/drinkController")
var eatController = require("./controllers/eatController")

// Routes
app.get("/", (req, res) => res.send("ok"))
app.use("/api/auth", authcontroller);
app.use("/api/restaurants", restaurantController);
app.use("/api/activities", activityController);
app.use("/api/hotels", hotelController);
app.use("/api/drinks", drinkController);
app.use("/api/eats", eatController);

// Start server on port 7000
app.listen(7000, () => console.log("Server is running"));

module.exports = app;
