// Importation des modules nécessaires
const express = require("express");
const userController = require("../controllers/user");
const validity = require("../middleware/check-data");

// Création du routeur
const router = express.Router();

// Création des routes
router.post("/signup", validity.checkEmail, validity.checkPassword, userController.signup);
router.post("/login", userController.login);

// Exportation du routeur
module.exports = router;
