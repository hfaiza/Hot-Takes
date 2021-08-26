// Importation des modules nécessaires
const express = require("express");
const userController = require("../controllers/user");
const checkValidity = require("../middleware/check-data");

// Création du routeur
const router = express.Router();

// Création des routes
router.post("/signup", checkValidity.checkEmail, checkValidity.checkPassword, userController.signup);
router.post("/login", userController.login);

// Exportation du routeur
module.exports = router;
