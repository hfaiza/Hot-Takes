// Importation des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const path = require("path");

// Accès aux variables d'environnement
require("dotenv").config();
const MONGODB_SECRET = process.env.MONGODB;

// Création de l'application
const app = express();

// Connexion à MongoDB :
const mongooseConnect = async () => {
  try {
    await mongoose.connect(MONGODB_SECRET, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("Connexion à MongoDB réussie !");
  } catch {
    console.log("Connexion à MongoDB échouée...");
  }
};

// Appel de la fonction
mongooseConnect();

// Ajout des headers nécessaires
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOW_ORIGIN);
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
app.use("/api/auth", userRoutes);

// Exportation de l'application
module.exports = app;
