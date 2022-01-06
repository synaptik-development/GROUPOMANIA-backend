const dotenv = require("dotenv").config();
const models = require("../models");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt_utils");
const asyncLib = require("async");
const CryptoJS = require("crypto-js");
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^(?=.*\d).{4,8}$/;

//------------------------------------------------------
// créer un nouvel utilisateur
//------------------------------------------------------
exports.register = (req, res, next) => {
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
  const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  const cryptedEmail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

  // test valeurs nulles
  if (username == null || email == null || password == null || confirmPassword == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  // test taille nom d'utilisateur
  if (username.length >= 15 || username.length < 3) {
    return res.status(400).json({ error: "Invalid username: between 3 and 15 characters" });
  }

  //test qualité email (model "emailregex.com")
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "invalid email" });
  }

  //test qualité mot de passe (regexlib.com => entre 4 et 8 caractères, une majuscule, une minuscule, un chiffre)
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ error: "invalid password, between 4 and 8 characters, minimum one uppercase, one lowercase and one number" });
  }

  // test correspondance des mots de passe
  if (password != confirmPassword) {
    return res.status(400).json({ error: "passwords not identical" });
  }

  asyncLib.waterfall(
    [
      (done) => {
        models.user
          .findOne({
            attributes: ["email"],
            where: { email: cryptedEmail },
          })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      (userFound, done) => {
        if (!userFound) {
          bcrypt.hash(password, 5, (error, bcryptedPassword) => {
            done(null, userFound, bcryptedPassword);
          });
        } else {
          return res.status(409).json({ error: "user already exist" });
        }
      },
      (userFound, bcryptedPassword, done) => {
        let newUser = models.user
          .create({
            username: username,
            email: cryptedEmail,
            password: bcryptedPassword,
          })
          .then((newUser) => {
            done(newUser);
          })
          .catch((error) => {
            return res.status(500).json({ error: "cannot create user, please try a new username" });
          });
      },
    ],
    (newUser) => {
      if (newUser) {
        return res.status(201).json(newUser);
      } else {
        return res.status(500).json({ error: "cannot add user" });
      }
    }
  );
};

//------------------------------------------------------
// se connecter
//------------------------------------------------------
exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
  const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  const cryptedEmail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

  // test valeurs nulles
  if (email == null || password == null) {
    return res.status(400).json({ error: "missing parameters" });
  }

  asyncLib.waterfall(
    [
      (done) => {
        models.user
          .findOne({
            where: { email: cryptedEmail },
          })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      (userFound, done) => {
        if (userFound) {
          bcrypt.compare(password, userFound.password, (error, resBcrypt) => {
            done(null, userFound, resBcrypt);
          });
        } else {
          return res.status(404).json({ error: "user not exist" });
        }
      },
      (userFound, resBcrypt, done) => {
        if (resBcrypt) {
          done(userFound);
        } else {
          return res.status(403).json({ error: "invalid password" });
        }
      },
    ],
    (userFound) => {
      if (userFound) {
        return res.status(201).json({
          userId: userFound.id,
          token: jwtUtils.generateToken(userFound),
        });
      } else {
        return res.status(500).json({ error: "cannot log on user" });
      }
    }
  );
};

//------------------------------------------------------
// voir le profil
//------------------------------------------------------
exports.getUser = (req, res, next) => {
  models.user
    .findOne({
      attributes: ["id", "username", "email", "admin", "createdAt", "updatedAt"],
      where: { id: req.params.id },
    })
    .then((userFound) => res.status(200).json(userFound))
    .catch((error) => res.status(404).json({ error }));
};

//------------------------------------------------------
// voir tous les profils
//------------------------------------------------------
exports.getAllUsers = (req, res, next) => {
  models.user
    .findAll({ attributes: ["id", "username", "email", "admin", "createdAt", "updatedAt"] })
    .then((users) => res.status(200).json(users))
    .catch(() => res.status(400).json({ error: "no users" }));
};

//------------------------------------------------------
// modifier le profil
//------------------------------------------------------
exports.modifyUser = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  let username = req.body.username;
  let email = req.body.email;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
  const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
  const cryptedEmail = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();

  // test champs vides
  if (!username && !email && !password) {
    return res.status(400).json({ error: "nothing to update" });
  }

  // test taille nom d'utilisateur
  if (username != null) {
    if (username.length >= 15 || username.length < 3) {
      return res.status(400).json({ error: "Invalid username: between 3 and 15 characters" });
    }
  }

  //test qualité email (model "emailregex.com")
  if (email != null) {
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "invalid email" });
    }
  }

  //test qualité mot de passe (regexlib.com => entre 4 et 8 caractères, une majuscule, une minuscule, un chiffre)
  if (password != null) {
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "invalid password, between 4 and 8 characters, minimum one uppercase, one lowercase and one number" });
    }

    if (password != confirmPassword) {
      return res.status(400).json({ error: "passwords not identical" });
    }
  }

  asyncLib.waterfall(
    [
      (done) => {
        models.user
          .findOne({
            attributes: ["id", "username", "email", "admin", "createdAt", "updatedAt"],
            where: { id: req.params.id },
          })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      (userFound, done) => {
        if (userFound) {
          done(null, userFound);
        } else {
          return res.status(404).json({ error: "user not found" });
        }
      },
      (userFound, done) => {
        if (userFound.id === userId) {
          userFound
            .update({
              username: username ? username : userFound.username,
              email: email ? cryptedEmail : userFound.email,
              password: password ? bcrypt.hashSync(password, 5) : userFound.password,
            })
            .then(() => {
              done(userFound);
            })
            .catch((error) => res.status(500).json({ error: "cannot uptate profil" }));
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (userFound) => {
      if (userFound) {
        if (!username && !email && !password) {
          return res.status(400).json({ message: "nothing to update" });
        } else {
          return res.status(200).json(userFound);
        }
      } else {
        return res.status(500).json({ error: "cannot uptate profil" });
      }
    }
  );
};

//------------------------------------------------------
// changer les droits utilisateur (modérateur)
//------------------------------------------------------
exports.changeUserRights = (req, res, next) => {
  const admin = jwtUtils.getUserAdmin(req.headers["authorization"]);
  let changeAdmin = req.body.admin;

  asyncLib.waterfall(
    [
      (done) => {
        models.user
          .findOne({
            attributes: ["id", "admin"],
            where: { id: req.params.id },
          })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      (userFound, done) => {
        if (userFound) {
          done(null, userFound);
        } else {
          return res.status(404).json({ error: "user not found" });
        }
      },
      (userFound, done) => {
        if (admin === true) {
          userFound
            .update({
              admin: changeAdmin ? changeAdmin : userFound.admin,
            })
            .then(() => {
              done(userFound);
            })
            .catch((error) => res.status(500).json({ error: "cannot update profil" }));
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (userFound) => {
      if (userFound) {
        return res.status(200).json({ message: "profile upgraded successfully" });
      } else {
        return res.status(500).json({ error: "cannot upgrade profil" });
      }
    }
  );
};

//------------------------------------------------------
// supprimer le profil
//------------------------------------------------------
exports.deleteUser = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const admin = jwtUtils.getUserAdmin(req.headers["authorization"]);
  asyncLib.waterfall(
    [
      (done) => {
        models.user
          .findOne({
            where: { id: req.params.id },
          })
          .then((userFound) => {
            done(null, userFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify user" });
          });
      },
      (userFound, done) => {
        if (userFound.id === userId || admin === true) {
          userFound
            .destroy()
            .then((deletedUser) => {
              done(deletedUser);
            })
            .catch((error) => res.status(500).json({ error: "cannot delete profil" }));
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (deleteUser) => {
      if (!deleteUser) {
        return res.status(500).json({ error: "cannot delete profil" });
      } else {
        return res.status(200).json({ message: "profile deleted successfully" });
      }
    }
  );
};
