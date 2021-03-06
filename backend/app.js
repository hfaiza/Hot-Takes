// Importation des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
require("dotenv").config();

// Importation des fichiers nécessaires
const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Accès aux variables d'environnement
const MONGODB_SECRET = process.env.MONGODB;
const ORIGIN_SECRET = process.env.ALLOW_ORIGIN;

// Création de l'application
const app = express();

// Utilisation de Helmet
app.use(helmet());

// Connexion à MongoDB Atlas :
const mongooseConnect = async () => {
  try {
    await mongoose.connect(MONGODB_SECRET, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.log("Connexion à MongoDB échouée !", error);
  }
};

// Appel de la fonction
mongooseConnect();

// Ajout des headers nécessaires
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN_SECRET);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// Pour extraire l'objet JSON des requêtes entrantes
app.use(express.json());

// Enregistrement des routes
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", sauceRoutes);
app.use("/api/auth", userRoutes);

// Exportation de l'application
module.exports = app;
