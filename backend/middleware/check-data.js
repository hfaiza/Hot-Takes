// Vérifie la validité de l'e-mail
const checkEmail = async (req, res, next) => {
  const userEmail = await req.body.email;
  const regex = /^[a-zA-Z0-9._+-]+@[a-zA-Z_+-]+\.[a-zA-Z]+$/;
  if (regex.test(userEmail) == false) {
    res.status(403).json({ error: "E-mail invalide." });
  } else {
    next();
  }
};

// Vérifie la validité du mot de passe
const checkPassword = async (req, res, next) => {
  const userPassword = await req.body.password.trim();
  if (userPassword == "" || userPassword.length < 5) {
    res.status(403).json({ error: "Mot de passe invalide." });
  } else {
    next();
  }
};

// Exportation des middlewares
exports.checkEmail = checkEmail;
exports.checkPassword = checkPassword;
