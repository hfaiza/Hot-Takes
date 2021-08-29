// Importation de JSON Web Token
const jwt = require("jsonwebtoken");

// Exportation du middleware d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(token, "SECRET_TOKEN");
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).json({ error: "Une authentification est nécessaire pour accéder à la ressource." });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({ error: "Requête invalide." });
  }
};
