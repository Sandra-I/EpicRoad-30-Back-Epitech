var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const request = require('request');
const path = require('path');


router.get("/", (req, res) => {

    let params = req.query;
    fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${params.origin}&destination=${params.destination}&mode=${params.mode}&waypoints=${params.waypoints}&key=AIzaSyAxU_TJgCawpDu7wSeaByWDpgVdvIGSiWw`)
        .then(resp => resp.json())
        .then(function(resp){
            res.send(resp);
        }).catch(function(respError){
            res.send(respError);
        });
});

module.exports = router;
