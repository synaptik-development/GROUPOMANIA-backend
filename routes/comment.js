const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const comCtrl = require("../controllers/comment");

//poster un commentaire
router.post("/:messageId/comments", auth, comCtrl.postComment);

//voir tous les commentaires d'un message
router.get("/:messageId/comments", auth, comCtrl.getAllComments);

//modifier un commentaire
router.put("/:messageId/comments/:commentId", auth, comCtrl.modifyComment);

//voir un commentaire
router.get("/:messageId/comments/:commentId", auth, comCtrl.getComment);

//supprimer un commentaire
router.delete("/:messageId/comments/:commentId", auth, comCtrl.deleteComment);

module.exports = router;
