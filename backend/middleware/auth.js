// Importation du module nécessaire
const jwt = require("jsonwebtoken");

// Exportation du middleware d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "SECRET_TOKEN");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw "Identifiant invalide !";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: new Error("Requête invalide !") });
  }
};
