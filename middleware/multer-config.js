const multer = require("multer");
const fs = require("fs");
const jwtUtils = require("../utils/jwt_utils");
// const userId = jwtUtils.getUserId(req.headers["authorization"]);

// dictionnaire des extensions de fichier
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

//
// objet de configuration de multer
// enregistrement sur le disque (diskStorage)
//
const storage = multer.diskStorage({
  // 1-définir la destination
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  // 2-personnaliser le nom du fichier posté
  filename: (req, file, callback) => {
    //nom d'origine du fichier en remplaçant les espaces par des _
    const name = file.originalname.split(" ").join("_");

    // création de l'extension du fichier
    const extension = MIME_TYPES[file.mimetype];

    // création du nom du fichier avec nom d'origine, un timestamp et l'extension
    callback(null, name + Date.now() + "." + extension);
  },
});

module.exports = multer({ storage: storage }).single("image");

// module.exports = {
//   saveFile: () => {
//     multer({ storage: storage }).single("image");
//   }
// }

// if (req.body.userId && req.body.userId !== userId)