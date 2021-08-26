// Importation des modules nécessaires
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware d'inscription
const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({ email: req.body.email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Utilisateur créé." });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Middleware de connexion
const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).json({ error: "Utilisateur non trouvé." });
    }
    const valid = bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      res.status(401).json({ error: "Mot de passe incorrect." });
    }
    const token = jwt.sign({ userId: user._id }, "SECRET_TOKEN");
    res.status(200).json({ userId: user._id, token: token });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Exportation des middlewares
exports.signup = signup;
exports.login = login;
