const jwt = require("jsonwebtoken");

const config = require("../../config");
const User = require("../models/User");

function isAuthenticated(req, res, next) {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({
      message: "Invalid authentication. Please include an access token",
    });
  }

  token = token.replace("Bearer ", "");

  return jwt.verify(token, config.sessionSecret, async function (err, user) {
    if (err) {
      return res.status(401).json({
        message: "Invalid authentication. Please use a valid access token to make requests",
      });
    }

    try {
      user = await User.findOne({ where: {_id: user.id } });

      if (!user) {
        return res.status(401).json({
          message: "Invalid authentication. Please use a valid access token to make requests",
        });
      }

      req.user = user._id;
      return next();
    } catch (err) {
        console.error(err);
    }
  });
}

module.exports = isAuthenticated;
