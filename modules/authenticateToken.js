const jwt = require("jsonwebtoken");
const User = require("../models/user")

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    User.findByPk(user.id)
    .then(user => {
      if(!user.enable ||err) return res.sendStatus(403);  
      req.user = user;
      next();
    })
    .catch(() => {
      res.sendStatus(403);
      next();
    })
  });
}

module.exports = authenticateToken;
