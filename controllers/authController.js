var express = require("express");
var router = express.Router();
const jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var User = require("../models/user")

let refreshTokens = []

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

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token)
  res.sendStatus(204)
})

router.post('/login', (req, res) => {
  const user = req.body;
  User.findOne({ where: { email: user.email }})
  .then(user_db => {
    let bytes  = CryptoJS.AES.decrypt(user_db.password, process.env.AES_ENCRYPTION_KEY);
    let decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
    if(decryptedPassword == user.password){
      delete user.password;
      user.id = user_db.id;
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      refreshTokens.push(refreshToken)
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    }
    else throw new Error("Wrong password")
  })
  .catch(err => {
    res.status(500).send('Authentification failed');
  })
})

router.post("/signup", (req, res) => {
    let user = req.body;
    user.password = CryptoJS.AES.encrypt(
      user.password,
      process.env.AES_ENCRYPTION_KEY
    ).toString();
    User.create(user)
      .then((user) => res.json(user))
      .catch((error) => {
        res.status(500).send(error);
      });
  });

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}


module.exports = router;