const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const messageCtrl = require("../controllers/message");

// voir tous les messages
router.get("/", auth, messageCtrl.getAllMessages);

// voir un message
router.get("/:messageId", auth, messageCtrl.getMessage);

// poster un message
router.post("/", auth, messageCtrl.postMessage);

// modifier un message
router.put("/:messageId", auth, messageCtrl.modifyMessage);

// supprimer un message
router.delete("/:messageId", auth, messageCtrl.deleteMessage);

module.exports = router;
