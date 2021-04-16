var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var User = require("../models/user")

let refreshTokens = []

// Refresh token
router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken })
  })
})

// Sign out user from server (-> remove user token from server)
router.delete('/signout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

// Sign in user (-> check if user exists and send token or not)
router.post('/signin', (req, res) => {
  const user = req.body;
  User.findOne({ where: { email: user.email } })
  .then(user_db => {
      let bytes = CryptoJS.AES.decrypt(user_db.password, process.env.AES_ENCRYPTION_KEY);
      let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (decryptedPassword == user.password) {
        delete user.password;
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)
        res.json(Object.assign({ accessToken: accessToken, refreshToken: refreshToken }, user_db.toJSON()))
      }
      else throw new Error("Wrong password")
    })
    .catch(err => {
      res.status(500).send('Authentification failed');
    })
})

// Sign up user (-> create new user)
router.post('/signup', (req, res) => {
  const user = req.body;
  if (!user.email || !user.password) {
    res.status(500).send('Email or password undefined')
  }
  // crypt password
  user.password = CryptoJS.AES.encrypt(user.password, process.env.AES_ENCRYPTION_KEY).toString();
  User.create(user)
    .then(user => res.json(user))
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

module.exports = router;