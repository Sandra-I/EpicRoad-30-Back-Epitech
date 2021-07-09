var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const request = require('request');
const path = require('path');


router.get("/", (req, res) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    let params = req.query;
    let url = `https://api.foursquare.com/v2/venues/explore?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=${process.env.FOURSQUARE_V}&section=drinks`

    if (!params.near) return res.status(500).send("Near parameter is empty")

    Object.keys(params).forEach(param => {
        url += `&${param}=${params[param]}`
    })

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => Promise.resolve(result.response.groups[0].items.map(data => {
            let venue = data.venue;
            delete venue.photos;
            venue.thumbnails = `${process.env.APP_URL}/api/drinks/${venue.id}/thumbnails`
            return venue;
        })))
        .then(result => res.send(result))
        .catch(error => console.log('error', error));
});

router.get("/:id/thumbnails", (req, res) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`https://api.foursquare.com/v2/venues/${req.params.id}/photos?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=${process.env.FOURSQUARE_V}&group=venue&limit=10`, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (!result.response.photos || (result.response.photos && result.response.photos.items.length == 0)) {
               res.sendFile(path.join(__dirname, '../images/default.jpg'))
            }
            else {
                let image = result.response.photos.items[0];
                let url = `${image.prefix}${image.width}x${image.height}${image.suffix}`
                request({
                    url: url,
                    encoding: null
                },
                    (err, resp, buffer) => {
                        console.log(url, resp.statusCode )
                        if (!err && resp.statusCode === 200) {
                            res.set("Content-Type", "image/jpeg");
                            res.send(resp.body);
                        }
                    });
            }
        })
        .catch(error => console.log('error', error));
});

router.get("/:id", (req, res) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch(`https://api.foursquare.com/v2/venues/${req.params.id}?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=${process.env.FOURSQUARE_V}&v=${req.params.id}`, requestOptions)
        .then(response => response.json())
        .then(result => res.send(result.response.venue))
        .catch(error => console.log('error', error));
});

module.exports = router;
