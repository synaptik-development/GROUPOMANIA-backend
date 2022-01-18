// importation du package express-rate-limit (attaque de force brute)
const rateLimit = require("express-rate-limit");

// configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite de 100 requêtes consécutives par tranches de 15 minutes
  standardHeaders: true, // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

module.exports = limiter;
