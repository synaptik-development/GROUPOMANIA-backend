const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userCtrl = require("../controllers/user");

//créer un profil
router.post("/register", userCtrl.register);

//se connecter
router.post("/login", userCtrl.login);

//voir tous les profils
router.get("/users", auth, userCtrl.getAllUsers);

//voir un profil
router.get("/users/:id", auth, userCtrl.getUser);

//modifier son profil
router.put("/users/:id", auth, userCtrl.modifyUser);

//changer les droits d'un utilisateur (modérateur / utilisateur lambda)
router.put("/users/:id/moderator", auth, userCtrl.changeUserRights);

//supprimer un profil
router.delete("/users/:id", auth, userCtrl.deleteUser);

module.exports = router;
