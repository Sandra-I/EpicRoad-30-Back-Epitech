var express = require("express");
var router = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
var authenticateToken = require("../modules/authenticateToken");
var Favori = require("../models/favoris");
const User = require("../models/user");


router.get("/", authenticateToken, (req, res) => {
    Favori.findAll().then(favoris => res.json(favoris.filter(favori => favori.user == req.user.id)))
        .catch(err => res.status(500).send(err))
});

router.get("/:type", authenticateToken, (req, res) => {
    Favori.findAll({
        where: {
            type: req.params.type
        }
    })
        .then(favoris => res.json(favoris.filter(favori => favori.user == req.user.id)))
        .catch(err => res.status(500).send(err))
})

router.post("/", authenticateToken, (req, res) => {
    Favori.create(Object.assign({user: req.user.id}, req.body))
    .then(a => res.json(a));
})

module.exports = router;
