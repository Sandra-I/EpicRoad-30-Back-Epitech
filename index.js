require("dotenv").config();

const express = require("express");
const app = express();
var cors = require("cors");
var sequelize = require("./database");

// Server settings
app.use(cors());
app.use(express.json());

// Contollers
var authcontroller = require("./controllers/authcontroller");
var usercontroller = require("./controllers/usercontroller");

// Routes
app.get("/", (req, res) => res.send("ok"))
app.use("/api/auth", authcontroller);
app.use("/api/users", usercontroller);

// Start server on port 7000
app.listen(7000, () => console.log("Server is running"));

module.exports = app;