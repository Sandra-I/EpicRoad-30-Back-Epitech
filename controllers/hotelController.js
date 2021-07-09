var express = require("express");
var router = express.Router();
var Amadeus = require('amadeus');

var amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET
});

var list_keys = ["cityCode","latitude","longitude","hotelIds","checkInDate",
"checkOutDate","roomQuantity","adults","radius","radiusUnit","hotelName",
"chains","rateCodes","amenities","ratings","priceRange","currency",
"payementPolicy","boardType","includeClosed","bestRateOnly","view","sort"
,"lang","cacheControl"]
var list_keys_id = ["hotelId","checkInDate","checkOutDate","adults","rateCodes",
"roomQuantity","currency","payementPolicy","boardType","view","lang"]
var new_params = {}

router.get("/", (req, res) => {

    let params = req.query;

    for(i=0;i<24;i++){
      if (params[list_keys[i]] != '') {
        new_params[list_keys[i]] = params[list_keys[i]]
      }
    }

    amadeus.shopping.hotelOffers.get(
        new_params
    ).then(function(response){
      res.send(response.data);
    }).catch(function(responseError){
      res.send(responseError);
    });

});

router.get("/by-hotel", (req, res) => {

    let params = req.query;

    for(i=0;i<24;i++){
      if (params[list_keys_id[i]] != '') {
        new_params[list_keys_id[i]] = params[list_keys_id[i]]
      }
    }

    amadeus.client.get(`/v2/shopping/hotel-offers/by-hotel`,
        new_params
    ).then(function(response){
      res.send(response.data);
    }).catch(function(responseError){
      res.send(responseError);
    });

});

module.exports = router;
