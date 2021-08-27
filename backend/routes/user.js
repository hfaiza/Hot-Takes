// Importation des modules nécessaires
const express = require("express");
const userController = require("../controllers/user");
const validity = require("../middleware/check-data");
const rateLimit = require("express-rate-limit");

// Pour limiter à 3 le nombre de requêtes lors de la connexion
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
});

// Création du routeur
const router = express.Router();

// Création des routes
router.post("/signup", validity.checkEmail, validity.checkPassword, userController.signup);
router.post("/login", limiter, userController.login);

// Exportation du routeur
module.exports = router;
