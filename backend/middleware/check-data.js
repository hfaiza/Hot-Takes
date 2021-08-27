// Importation des modules nécessaires
const jwt = require("jsonwebtoken");
const Sauce = require("../models/sauce");

// Vérifie la validité de l'e-mail
const checkEmail = (req, res, next) => {
  const userEmail = req.body.email;
  // General Email Regex (RFC 5322 Official Standard) :
  const regex =
    /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
  if (regex.test(userEmail) == false) {
    res.status(403).json({ error: "E-mail invalide." });
  } else {
    next();
  }
};

// Vérifie la validité du mot de passe
const checkPassword = (req, res, next) => {
  const userPassword = req.body.password;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;
  if (regex.test(userPassword) == false) {
    res.status(403).json({
      error:
        "Mot de passe invalide. Il doit avoir entre 8 et 64 caractères et contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial.",
    });
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

// Vérifie les données de la sauce avant son ajout/sa modification
const checkSauceData = (req, res, next) => {
  const sauce = JSON.parse(req.body.sauce);
  const descriptionRegex = /^[\.a-zA-Z, ]{20,250}$/;
  const description = sauce.description.trim();

  if (descriptionRegex.test(description) == false) {
    throw new Error(
      "Description invalide. Seuls les lettres, espaces, points et virgules sont acceptés. Le texte doit contenir entre 20 et 250 caractères."
    );
  }

  delete sauce.heat;
  delete sauce.userId;
  delete sauce.description;

  const valuesArray = Object.values(sauce);
  const valuesRegex = /^[a-zA-Z ]{5,40}$/;

  valuesArray.forEach((value) => {
    value.trim();
    if (valuesRegex.test(value) == false) {
      throw new Error(
        "Donnée invalide. Seuls les lettres et espaces sont acceptés. Le texte doit contenir entre 5 et 40 caractères."
      );
    }
  });
  next();
};

// Exportation des middlewares
exports.checkEmail = checkEmail;
exports.checkPassword = checkPassword;
exports.checkUserId = checkUserId;
exports.checkSauceData = checkSauceData;
