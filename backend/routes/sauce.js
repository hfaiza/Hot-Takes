// Importation des modules nécessaires
const express = require("express");
const sauceController = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// Création du routeur
const router = express.Router();

// Création des routes
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);
router.post("/", auth, multer, sauceController.createSauce);
router.put("/:id", auth, multer, sauceController.modifySauce);
router.delete("/:id", auth, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeAndDislikeSauce);

// Exportation du routeur
module.exports = router;
