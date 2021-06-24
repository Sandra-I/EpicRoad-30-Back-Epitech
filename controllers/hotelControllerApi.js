var express = require("express");
var router = express.Router();
var Amadeus = require('amadeus');


var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

router.get("/", (req, res) => {

    let params = req.query;

    amadeus.shopping.hotelOffers.get(
        params
    ).then(function(response){
      res.send(response.data);
    }).catch(function(responseError){
      res.send(responseError);
    });

});

module.exports = router;
