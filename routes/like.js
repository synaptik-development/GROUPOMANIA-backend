const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const likesCtrl = require("../controllers/like");

//liker / retirer like
router.post("/:messageId/likes", auth, likesCtrl.likeMessage);

//voir si le message est liké
router.get("/:messageId/likes", auth, likesCtrl.getIfUserlike);

module.exports = router;
