const models = require("../models");
const fs = require("fs");
const jwtUtils = require("../utils/jwt_utils");
const asyncLib = require("async");
const express = require("express");
const multer = require("../middleware/multer-config");

//------------------------------------------------------
// voir tous les messages
//------------------------------------------------------
exports.getAllMessages = (req, res, next) => {
  models.message
    .findAll({
      order: [["createdAt", "DESC"]],
    })
    .then((messages) => res.status(200).json(messages))
    .catch((error) => {
      return res.status(400).json({ error: "empty news wall" });
    });
};

//------------------------------------------------------
// voir un message
//------------------------------------------------------
exports.getMessage = (req, res, next) => {
  const messageId = req.params.messageId;

  models.message
    .findOne({ where: { id: messageId } })
    .then((message) => res.status(200).json(message))
    .catch((error) => {
      return res.status(400).json({ error: "unable to verify message" });
    });
};

//------------------------------------------------------
// poster un message
//------------------------------------------------------
exports.postMessage = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  multer(req, res, (error) => {
    asyncLib.waterfall(
      [
        (done) => {
          models.user
            .findOne({
              attributes: ["id", "username"],
              where: { id: userId },
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
          if (!req.body.content && !req.file) {
            return res.status(400).json({ error: "nothing to post" });
          } else {
            let newMessage = models.message
              .create({
                userId: userId,
                username: userFound.username,
                content: req.body.content ? req.body.content : "",
                imageUrl: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : undefined,
                likes: 0,
              })
              .then((newMessage) => {
                done(newMessage);
              })
              .catch((error) => {
                return res.status(500).json({ error: "cannot create message" });
              });
          }
        },
      ],
      (newMessage) => {
        if (newMessage) {
          return res.status(201).json(newMessage);
        } else {
          return res.status(500).json({ error: "cannot add message" });
        }
      }
    );
  });
};

//------------------------------------------------------
// modifier un message
//------------------------------------------------------
exports.modifyMessage = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;

  asyncLib.waterfall(
    [
      (done) => {
        models.message
          .findOne({ where: { id: messageId } })
          .then((messageFound) => {
            done(null, messageFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      (messageFound, done) => {
        if (messageFound) {
          done(null, messageFound);
        } else {
          return res.status(404).json({ error: "message not found" });
        }
      },
      (messageFound, done) => {
        if (messageFound.userId === userId) {
          multer(req, res, (error) => {
            if (!req.body.content && !req.file) {
              return res.status(400).json({ error: "nothing to update" });
            }

            //suppression de l'ancienne image si il y en a une nouvelle
            if (req.file && messageFound.imageUrl != null) {
              const filename = messageFound.imageUrl.split("/images/")[1];
              fs.unlinkSync(`images/${filename}`);
            }
            messageFound
              .update({
                content: req.body.content ? req.body.content : messageFound.content,
                imageUrl: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` : messageFound.imageUrl,
              })
              .then((messageUpdated) => {
                done(messageUpdated);
              })
              .catch((error) => {
                return res.status(500).json({ error: "cannot update message" });
              });
          });
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (messageUpdated) => {
      if (messageUpdated) {
        return res.status(200).json( messageUpdated );
      } else {
        return res.status(500).json({ error: "cannot update message" });
      }
    }
  );
};

//------------------------------------------------------
// supprimer un message
//------------------------------------------------------
exports.deleteMessage = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const admin = jwtUtils.getUserAdmin(req.headers["authorization"]);
  const messageId = req.params.messageId;

  asyncLib.waterfall(
    [
      (done) => {
        models.message
          .findOne({ where: { id: messageId } })
          .then((messageFound) => {
            done(null, messageFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      (messageFound, done) => {
        if (messageFound) {
          if (messageFound.userId === userId || admin === true) {
            if (messageFound.imageUrl != null) {
              const filename = messageFound.imageUrl.split("/images/")[1];
              fs.unlinkSync(`images/${filename}`);
            }

            messageFound
              .destroy()
              .then(() => {
                done(messageFound);
              })
              .catch((error) => {
                return res.status(500).json({ error: "message not deleted" });
              });
          }
        } else {
          return res.status(404).json({ error: "unauthorized request" });
        }
      },
    ],
    (messageFound) => {
      if (messageFound) {
        return res.status(200).json({ message: "message deleted successfully" });
      } else {
        return res.status(500).json({ error: "cannot delete message" });
      }
    }
  );
};
