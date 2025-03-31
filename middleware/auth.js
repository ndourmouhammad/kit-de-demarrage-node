const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Import du modèle utilisateur
const Blacklist = require("../models/blacklist");
const config = process.env;

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      success: false,
      msg: "A token is required for authentication",
    });
  }

  try {
    const bearer = token.split(" ");
    const bearerToken = bearer[1];

    const blacklistedToken = await Blacklist.findOne({ token: bearerToken });

    if (blacklistedToken) {
      return res.status(400).send({
        success: false,
        msg: "This session has expired, please try again",
      });
    }

    const decodedData = jwt.verify(bearerToken, config.ACCESS_TOKEN_SECRET);

    // 🔥 Récupération des infos complètes de l'utilisateur
    const user = await User.findById(decodedData.userId).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        msg: "User not found",
      });
    }

    req.user = user; // On attache l'utilisateur complet à la requête
  } catch (e) {
    return res.status(401).send({
      success: false,
      msg: "Invalid token",
    });
  }

  return next();
};

module.exports = verifyToken;
