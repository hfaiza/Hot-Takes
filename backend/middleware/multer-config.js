// Importation du module nécessaire
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
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = mimeTypes[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

// Exportation de l'élément multer
module.exports = multer({ storage: storage }).single("image");
