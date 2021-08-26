// Importation des modules nécessaires
const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");

// Vérifie la validité de l'e-mail
const checkEmail = (req, res, next) => {
  const userEmail = req.body.email;
  // General Email Regex (RFC 5322 Official Standard) :
  const regex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  if (!userEmail || regex.test(userEmail) == false) {
    res.status(403).json({ error: "E-mail invalide." });
  } else {
    next();
  }
};

// Vérifie la validité du mot de passe
const checkPassword = (req, res, next) => {
  if (!req.body.password) {
    res.status(403).json({ error: "Mot de passe invalide." });
  }
  const userPassword = req.body.password.trim();
  if (userPassword == "" || userPassword.length < 5) {
    res.status(403).json({ error: "Mot de passe invalide." });
  } else {
    next();
  }
};

// Vérifie l'id de l'user souhaitant modifier/supprimer une sauce
const checkUserId = async (req, res, next) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const sauceCreator = sauce.userId;

    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, "SECRET_TOKEN");
    const sauceEditor = decodedToken.userId;

    if (sauceEditor != sauceCreator) {
      res.status(403).json({ error: "Requête non autorisée." });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Exportation des middlewares
exports.checkEmail = checkEmail;
exports.checkPassword = checkPassword;
exports.checkUserId = checkUserId;
