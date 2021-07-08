require('dotenv').config()
const express = require("express");
const app = express();
var cors = require("cors");
var sequelize = require("./database");
var Favoris = require("./models/favoris")

// Server settings
app.use(cors());
app.use(express.json());

// Contollers
var authcontroller = require("./controllers/authController");
var activityController = require("./controllers/activityController")
var hotelController = require("./controllers/hotelController")
var drinkController = require("./controllers/drinkController")
var eatController = require("./controllers/eatController")
var favoriController = require("./controllers/favoriController")
var transportController = require("./controllers/transportController")

// Routes
app.get("/", (req, res) => res.send("ok"))
app.use("/api/auth", authcontroller);
app.use("/api/hotels", hotelController);
app.use("/api/activities", activityController);
app.use("/api/drinks", drinkController);
app.use("/api/eats", eatController);
app.use("/api/favoris", favoriController);
app.use("/api/transport",transportController);

// Start server on port 7000
app.listen(7000, () => console.log("Server is running"));

module.exports = app;
