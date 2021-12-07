const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const likesCtrl = require("../controllers/like");

//liker un message
router.post("/:messageId/likes/like", auth, likesCtrl.likeMessage);

//retirer son like
router.post("/:messageId/likes/removelike", auth, likesCtrl.removeLike);

//voir qui a liké le message
router.get("/:messageId/likes", auth, likesCtrl.getWholiked);

module.exports = router;
