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

      amadeus.shopping.activities.get(
          {
            latitude: params.lat,
            longitude: params.lng,
            radius: params.radius
          }
      ).then(function(resp){
        res.send(resp.data);
      }).catch(function(respError){
        res.send(respError);
      });
});

router.get("/:id", (req, res) => {

      let id = req.params.id

      amadeus.client.get(`/v1/shopping/activities/${id}`,
          {}
      ).then(function(resp){
        res.send(resp.data);
      }).catch(function(respError){
        res.send(respError);
      });

});

module.exports = router;
