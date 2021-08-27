// Importation des modules nécessaires
const express = require("express");
const sauceController = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const validity = require("../middleware/check-data");

// Création du routeur
const router = express.Router();

// Création des routes
router.get("/", auth, sauceController.getAllSauces);
router.get("/:id", auth, sauceController.getOneSauce);
router.post("/", auth, multer, validity.checkSauceData, sauceController.createSauce);
router.put("/:id", auth, validity.checkUserId, multer, validity.checkSauceData, sauceController.modifySauce);
router.delete("/:id", auth, validity.checkUserId, sauceController.deleteSauce);
router.post("/:id/like", auth, sauceController.likeAndDislikeSauce);

// Exportation du routeur
module.exports = router;
