const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const SIGN_TOKEN = `${process.env.TOKEN}`;

// Exported functions
module.exports = {
  generateToken: (userData) => {
    return jwt.sign(
      {
        userId: userData.id,
        admin: userData.admin,
      },
      SIGN_TOKEN,
      {
        expiresIn: "24h",
      }
    );
  },
  parseAuthorization: (authorization) => {
    return authorization != null ? authorization.replace("Bearer ", "") : null;
  },

  // obtenir l'id de l'utilisateur connecté
  getUserId: (authorization) => {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, SIGN_TOKEN);
        if (jwtToken != null) userId = jwtToken.userId;
      } catch (err) {}
    }
    return userId;
  },

  // voir les droits administrateurs de l'utilisateur connecté
  getUserAdmin: (authorization) => {
    let admin = 0;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, SIGN_TOKEN);
        if (jwtToken != null) admin = jwtToken.admin;
      } catch (err) {}
    }
    return admin;
  },
};
