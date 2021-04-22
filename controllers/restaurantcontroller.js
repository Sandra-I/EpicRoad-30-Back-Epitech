var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  Documenu.Restaurants.getByState('NY')
    .then(result => {
      res.json(result)
    });
});

module.exports = router;
