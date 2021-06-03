var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
var Amadeus = require('amadeus');



var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});



router.get("/", (req, res) => {

    let params = req.query;
    //res.send(params.cityCode)

    amadeus.shopping.hotelOffers.get({
        cityCode: params.cityCode,
        latitude: params.latitude,
        longitude: params.longitude
    }).then(function(response){
      res.send(response.data);
    }).catch(function(responseError){
      res.send(responseError.code);
    });

});

module.exports = router;
