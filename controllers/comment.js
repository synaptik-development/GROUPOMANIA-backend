const models = require("../models");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt_utils");
const asyncLib = require("async");

//------------------------------------------------------
// voir tous les commentaires
//------------------------------------------------------
exports.getAllComments = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;

  asyncLib.waterfall(
    [
      (done) => {
        models.message
          .findOne({
            where: { id: messageId },
          })
          .then((messageFound) => {
            done(null, messageFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      (messageFound, done) => {
        if (messageFound) {
          models.comment
            .findAll({
              attributes: ["id", "userId", "messageId", "content", "username", "createdAt"],
              where: { messageId: messageId },
              order: [["createdAt", "DESC"]],
            })
            .then((comments) => {
              done(comments);
            })
            .catch(() => res.status(400).json({ error: "unable to check comments" }));
        } else {
          return res.status(404).json({ error: "message not found" });
        }
      },
    ],
    (comments) => {
      if (comments) {
        return res.status(200).json(comments);
      } else {
        return res.status(404).json({ error: "no comment found" });
      }
    }
  );
};

//------------------------------------------------------
// ajouter un commentaire
//------------------------------------------------------
exports.postComment = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;
  const content = req.body.content;

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
        models.message
          .findOne({
            where: { id: messageId },
          })
          .then((messageFound) => {
            done(null, userFound, messageFound);
          })
          .catch((error) => {
            return res.status(500).json({ error: "unable to verify message" });
          });
      },
      (userFound, messageFound, done) => {
        if (messageFound) {
          if (!content) {
            return res.status(400).json({ error: "nothing to post" });
          }

          models.comment
            .create({
              userId: userId,
              messageId: messageFound.id,
              username: userFound.username,
              content: content,
            })
            .then((newComment) => {
              done(newComment);
            })
            .catch((error) => {
              return res.status(500).json({ error: "cannot create comment" });
            });
        } else {
          return res.status(404).json({ error: "message not found" });
        }
      },
    ],
    (newComment) => {
      if (newComment) {
        return res.status(201).json(newComment);
      } else {
        return res.status(500).json({ error: "cannot add comment" });
      }
    }
  );
};

//------------------------------------------------------
// modifier un commentaire
//------------------------------------------------------
exports.modifyComment = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const commentId = req.params.commentId;
  const content = req.body.content;

  asyncLib.waterfall(
    [
      (done) => {
        models.comment
          .findOne({ where: { id: commentId } })
          .then((commentFound) => {
            done(null, commentFound);
          })
          .catch(() => res.status(400).json({ error: "unable to check comments" }));
      },
      (commentFound, done) => {
        if (commentFound) {
          done(null, commentFound);
        } else {
          return res.status(403).json({ error: "comment not found" });
        }
      },
      (commentFound, done) => {
        if (commentFound.userId === userId) {
          if (!content) {
            return res.status(400).json({ error: "nothing to post" });
          }

          commentFound
            .update({
              content: content ? content : commentFound.content,
            })
            .then((commentUpdated) => {
              done(commentUpdated);
            })
            .catch((error) => {
              return res.status(500).json({ error: "cannot update comment" });
            });
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (commentUpdated) => {
      if (commentUpdated) {
        return res.status(200).json(commentUpdated);
      } else {
        return res.status(500).json({ error: "cannot update comment" });
      }
    }
  );
};

//------------------------------------------------------
// supprimer un commentaire
//------------------------------------------------------
exports.deleteComment = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const admin = jwtUtils.getUserAdmin(req.headers["authorization"]);
  const commentId = req.params.commentId;

  asyncLib.waterfall(
    [
      (done) => {
        models.comment
          .findOne({ where: { id: commentId } })
          .then((commentFound) => {
            done(null, commentFound);
          })
          .catch(() => res.status(400).json({ error: "unable to check comments" }));
      },
      (commentFound, done) => {
        if (commentFound) {
          done(null, commentFound);
        } else {
          return res.status(403).json({ error: "comment not found" });
        }
      },
      (commentFound, done) => {
        if (commentFound.userId === userId || admin === true) {
          commentFound
            .destroy()
            .then(() => {
              done(commentFound);
            })
            .catch((error) => {
              return res.status(500).json({ error: "cannot update comment" });
            });
        } else {
          return res.status(403).json({ error: "unauthorized request" });
        }
      },
    ],
    (commentFound) => {
      if (commentFound) {
        return res.status(200).json({ message: "comment deleted successfully" });
      } else {
        return res.status(500).json({ error: "cannot delete comment" });
      }
    }
  );
};

//------------------------------------------------------
// voir un commentaire
//------------------------------------------------------
exports.getComment = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;
  const commentId = req.params.commentId;
  const content = req.body.content;

  asyncLib.waterfall(
    [
      (done) => {
        models.comment
          .findOne({
            attributes: ["id", "userId", "messageId", "content"],
            where: {
              id: commentId,
              messageId: messageId,
            },
          })
          .then((commentFound) => {
            done(commentFound);
          })
          .catch(() => res.status(400).json({ error: "unable to check comments" }));
      },
    ],
    (commentFound) => {
      if (commentFound) {
        return res.status(200).json(commentFound);
      } else {
        return res.status(500).json({ error: "cannot update comment" });
      }
    }
  );
};
