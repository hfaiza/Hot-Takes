// Importation des modules nécessaires
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// Création du schéma d'utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Pour appliquer le validateur au schéma
userSchema.plugin(uniqueValidator);

// Exportation du schéma sous forme de modèle
module.exports = mongoose.model("User", userSchema);
