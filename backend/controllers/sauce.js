// Importation de File System
const fs = require("fs");

// Importation du fichier nécessaire
const Sauce = require("../models/sauce");

// Middleware de création d'une sauce
const createSauce = async (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  if (req.file === undefined) {
    return res.status(400).json({ error: "Requête invalide !" });
  }
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  try {
    await sauce.save();
    res.status(201).json({ message: "Sauce enregistrée !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Middleware d'obtention d'une sauce
const getOneSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    res.status(200).json(sauce);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

// Middleware de modification d'une sauce
const modifySauce = async (req, res) => {
  if (req.file) {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, (error) => {
      if (error) {
        return res.status(400).json({ error });
      }
    });
  }
  const sauceObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  try {
    await Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id });
    return res.status(200).json({ message: "Sauce modifiée !" });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Middleware de suppression d'une sauce
const deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const filename = sauce.imageUrl.split("/images/")[1];
    await Sauce.deleteOne({ _id: req.params.id });
    fs.unlink(`images/${filename}`, (error) => {
      if (error) {
        res.status(400).json({ error });
      } else {
        res.status(200).json({ message: "Sauce supprimée !" });
      }
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Middleware d'obtention de toutes les sauces
const getAllSauces = async (req, res) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (error) {
    res.status(404).json({ error: error });
  }
};

// Factorisation du middleware de (dis)like d'une sauce
const updateLikeOrDislike = async (req, res, likeStatus, likeOperator, arrayOperator, usersArray) => {
  const userId = req.body.userId;
  try {
    await Sauce.updateOne(
      { _id: req.params.id },
      { $inc: { [likeStatus]: likeOperator }, [arrayOperator]: { [usersArray]: userId } }
    );
    res.status(200).json({ message: "L'opération s'est bien déroulée !" });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Middleware de (dis)like d'une sauce
const likeAndDislikeSauce = async (req, res) => {
  try {
    const userId = req.body.userId;
    const like = req.body.like;
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const userAlreadyLiked = sauce.usersLiked.includes(userId);
    const userAlreadyDisliked = sauce.usersDisliked.includes(userId);

    if (like == 1 && !userAlreadyLiked && !userAlreadyDisliked) {
      updateLikeOrDislike(req, res, "likes", +1, "$push", "usersLiked");
    } else if (like == -1 && !userAlreadyLiked && !userAlreadyDisliked) {
      updateLikeOrDislike(req, res, "dislikes", +1, "$push", "usersDisliked");
    } else if (like == 0 && userAlreadyLiked) {
      updateLikeOrDislike(req, res, "likes", -1, "$pull", "usersLiked");
    } else if (like == 0 && userAlreadyDisliked) {
      updateLikeOrDislike(req, res, "dislikes", -1, "$pull", "usersDisliked");
    } else {
      res.status(400).json({ error: "Requête invalide !" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Exportation des middlewares
exports.createSauce = createSauce;
exports.getOneSauce = getOneSauce;
exports.modifySauce = modifySauce;
exports.deleteSauce = deleteSauce;
exports.getAllSauces = getAllSauces;
exports.likeAndDislikeSauce = likeAndDislikeSauce;
