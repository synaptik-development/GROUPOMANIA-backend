const models = require("../models");
const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwt_utils");
const asyncLib = require("async");

//------------------------------------------------------
// voir qui a liké le message
//------------------------------------------------------
exports.getWholiked = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;

  models.like.findAll({where: {messageId: messageId}})
  .then((like) => res.status(200).json(like))
    .catch((error) => {
      return res.status(400).json({ error: "unable to verify who liked" });
    });
}

//------------------------------------------------------
// liker / retirer like
//------------------------------------------------------
exports.likeMessage = (req, res, next) => {
  const userId = jwtUtils.getUserId(req.headers["authorization"]);
  const messageId = req.params.messageId;

  if(req.body.like == 0) {
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
            models.like
              .findOne({
                where: {
                  userId: userId,
                  messageId: messageId,
                },
              })
              .then((alreadyLiked) => {
                done(null, messageFound, alreadyLiked);
              })
              .catch((error) => {
                return res.status(500).json({ error: "unable to verify user liked" });
              });
          } else {
            return res.status(500).json({ error: "message not found" });
          }
        },
        (messageFound, alreadyLiked, done) => {
          if (alreadyLiked) {
            alreadyLiked
              .destroy()
              .then(() => {
                messageFound
                  .update({
                    likes: messageFound.likes - 1,
                  })
                  .then(() => {
                    done(messageFound);
                  })
                  .catch((error) => {
                    return res.status(500).json({ error: "unable to decrement likes" });
                  });
              })
              .catch((error) => {
                return res.status(500).json({ error: "unable remove mention" });
              });
          } else {
            return res.status(409).json({ error: "user did not like this message" });
          }
        },
      ],
      (messageFound) => {
        if (messageFound) {
          return res.status(201).json({ message: "user removed mention" });
        } else {
          return res.status(409).json({ error: "cannot remove mention" });
        }
      }
    );
  }

  if (req.body.like == 1) {
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
            models.like
              .findOne({
                where: {
                  userId: userId,
                  messageId: messageId,
                },
              })
              .then((alreadyLiked) => {
                done(null, messageFound, alreadyLiked);
              })
              .catch((error) => {
                return res.status(500).json({ error: "unable to verify user liked" });
              });
          } else {
            return res.status(500).json({ error: "message not found" });
          }
        },
        (messageFound, alreadyLiked, done) => {
          if (!alreadyLiked) {
            models.like
              .create({
                userId: userId,
                messageId: messageId,
              })
              .then((nowLiked) => {
                messageFound
                  .update({
                    likes: messageFound.likes + 1,
                  })
                  .then(() => {
                    done(messageFound);
                  })
                  .catch((error) => {
                    return res.status(500).json({ error: "unable to increment likes" });
                  });
              })
              .catch((error) => {
                return res.status(500).json({ error: "unable to set mention" });
              });
          } else {
            return res.status(409).json({ error: "user already liked this message" });
          }
        },
        (messageFound) => {
          messageFound
            .update({
              likes: messageFound.likes + 1,
            })
            .then(() => {
              done(messageFound);
            })
            .catch((error) => {
              return res.status(500).json({ error: "unable to increment likes" });
            });
        },
      ],
      (messageFound) => {
        if (messageFound) {
          return res.status(201).json({ message: "user liked this message" });
        } else {
          return res.status(409).json({ error: "cannot add mention" });
        }
      }
    );
  }
  
};