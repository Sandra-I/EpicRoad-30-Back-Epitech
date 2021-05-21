var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');


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
        .then(result => Promise.resolve(result.response.groups[0].items.reduce((acc, data) => {
            return acc.then(venues => {
                let venue = data.venue;
                return fetch(`https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${process.env.FOURSQUARE_CLIENT_ID}&client_secret=${process.env.FOURSQUARE_CLIENT_SECRET}&v=${process.env.FOURSQUARE_V}&group=venue`, requestOptions)
                    .then(images => {
                        console.log(images)
                        venue.photos = images.response.photos.items.map(photo => `${process.env.APP_URL}/api/drinks/images/${photo.id}`);
                        venues.push(venue);
                        return Promise.resolve(venues);
                    })
            })
        }, Promise.resolve([]))))
        .then(result => res.send(result))
        .catch(error => console.log('error', error));
});

router.get("/category/:id/icon", (req, res) => {

})

router.get("/:id", (req, res) => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    fetch("https://api.foursquare.com/v2/venues/explore?client_id=412CJZH3QFA5OPU4ULYTJX3XQTDRVS3W2EQLMAMXWQJYPRDO&client_secret=41REZKRI5QZEPEKYQO35FOEALWHEP5EAEXV4S55NESXUTVJZ&v=20190425&near=Paris&section=drinks&limit=10&offset=5&price=2,3", requestOptions)
        .then(response => response.json())
        .then(result => res.send(result))
        .catch(error => console.log('error', error));
});


const downloadImage = url => {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    return fetch(url, requestOptions)
        .then(result => result.json())
        .then(result => Promise.all(result.response.photo.map()))
        .then(buffer => new Promise((resolve, reject) => fs.writeFile(`./image.jpg`, buffer, () => resolve())
        ))
}

module.exports = router;
