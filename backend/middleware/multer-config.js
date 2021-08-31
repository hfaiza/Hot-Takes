// Importation de Multer
const multer = require("multer");

// Pour générer l'extension des fichiers
const mimeTypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

// Enregistrement des fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
      callback(null, "images");
    } else {
      callback(new Error("Requête invalide !"));
    }
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = mimeTypes[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exportation de l'élément multer
module.exports = multer({ storage: storage }).single("image");
