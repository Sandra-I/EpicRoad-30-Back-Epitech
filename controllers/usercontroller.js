var express = require("express");
var router = express.Router();
var authenticateToken = require("../modules/authenticateToken");
var User = require("../models/user");

router.get("/me", authenticateToken, (req, res) => {
  User.findOne({ where: { email: req.user.email }})
  .then(user => {
    user = user.toJSON();
    delete user.password;
    res.json(user);
  })
  .catch(err => {
    res.status(500).send('Wrong token');
  })
});

module.exports = router;
