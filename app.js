//importation du package dotenv pour utiliser les variables d'environnement
const dotenv = require("dotenv").config();

// importation du package express (création d'application)
const express = require("express");
const app = express();

// importation du package express
const helmet = require("helmet");

// importation du package body-parser
const bodyParser = require("body-parser");

//importation des routes
const usersRoutes = require("./routes/user");
const messagesRoutes = require("./routes/message");
const likesRoute = require("./routes/like");
const commentsRoute = require("./routes/comment");

// accés au chemin du système de fichiers
const path = require("path");

// test connection à la base de données
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.DB_PASSWORD}`, {
  dialect: "mysql",
  host: "localhost",
});

try {
  sequelize.authenticate();
  console.log("connexion à la base de données réussie");
} catch (error) {
  console.error("connexion à la base de données impossible:", error);
}
// ------------------------------------- //
// middleware
// ------------------------------------- //

// utilisé pour tous types de requêtes //

// headers pour contrôler les erreurs de cors (Cross Origin Resource Sharing), sécurité qui bloque les requêtes http entre 2 serveurs différents
app.use((req, res, next) => {
  // accéder à notre API depuis n'importe quelle origine ( '*' )
  res.setHeader("Access-Control-Allow-Origin", "*");

  // ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.)
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");

  // envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");

  // forcer la protection XSS(1) empécher l'ouverture de la page en cas d'attaque(mode-block)
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// importation des routes
app.use("/api/auth", usersRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/messages", likesRoute);
app.use("/api/messages", commentsRoute);
app.use("/images", express.static(path.join(__dirname, "images")));

// exportation de l'application
module.exports = app;
