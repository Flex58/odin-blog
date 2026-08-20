require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.issueAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 60 * 15 }); //15minutes
};
