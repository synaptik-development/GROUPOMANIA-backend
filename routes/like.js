const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const likesCtrl = require("../controllers/like");

//liker / retirer like
router.post("/:messageId/likes", auth, likesCtrl.likeMessage);

//voir qui a liké le message
router.get("/:messageId/likes", auth, likesCtrl.getWholiked);

module.exports = router;
