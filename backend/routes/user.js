// Importation des modules nécessaires
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../middleware/auth");

// Création du routeur
const router = express.Router();

// Création des routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);

// Exportation du routeur
module.exports = router;
