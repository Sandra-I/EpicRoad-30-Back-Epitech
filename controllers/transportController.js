var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const request = require('request');
const path = require('path');


router.get("/", (req, res) => {

    let params = req.query;
    //coordinates of origin address
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${params.origin}&key=AIzaSyAxU_TJgCawpDu7wSeaByWDpgVdvIGSiWw`)
        .then(response => response.json())
        .then(response => {
          return Promise.resolve(response.results[0].geometry.location)
        })
        .then(response => {
          let origin = response;
          //coordinates of destination address
          fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${params.destination}&key=AIzaSyAxU_TJgCawpDu7wSeaByWDpgVdvIGSiWw`)
            .then(result => result.json())
            .then(result => {
              return Promise.resolve(result.results[0].geometry.location)
            })
            .then(result => {
              let destination = result;
              //direction between origin and destination
              fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${params.mode}&key=AIzaSyAxU_TJgCawpDu7wSeaByWDpgVdvIGSiWw`)
                .then(resp => resp.json())
                .then(function(resp){
                  res.send(resp);
                }).catch(function(respError){
                  res.send(respError);
                });
            })
        })

});

module.exports = router;
