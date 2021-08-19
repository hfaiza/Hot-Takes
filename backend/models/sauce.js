// Importation du module nécessaire
const mongoose = require("mongoose");

// Création du schéma de sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  // likes: { type: Number, required: true },
  // dislikes: { type: Number, required: true },
  // usersLiked: { type: [String], required: true },
  // usersDisliked: { type: [String], required: true },
});

// Exportation du schéma sous forme de modèle
module.exports = mongoose.model("Sauce", sauceSchema);
