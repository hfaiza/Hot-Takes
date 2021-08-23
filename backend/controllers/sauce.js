// Importation des modules nécessaires
const Sauce = require("../models/sauce");
const fs = require("fs");

// Middleware de création d'une sauce
const createSauce = async (req, res) => {
  const sauceObject = await JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersdisLiked: [],
  });
  try {
    await sauce.save();
    res.status(201).json({ message: "Sauce enregistrée !" });
  } catch (error) {
    res.status(400).json({ error });
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
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  try {
    await Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObject, _id: req.params.id }
    );
    res.status(200).json({ message: "Sauce modifiée !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Middleware de suppression d'une sauce
const deleteSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });
    const filename = sauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      try {
        await Sauce.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Sauce supprimée !" });
      } catch (error) {
        res.status(400).json({ error });
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
    res.status(400).json({ error: error });
  }
};

// Middleware de (dis)like d'une sauce
const likeAndDislikeSauce = async (req, res) => {
  try {
    const userId = req.body.userId;
    const like = req.body.like;

    if (like == 1) {
      try {
        await Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { likes: +1 }, $push: { usersLiked: userId } }
        );
        res.status(200).json({ message: "Like confirmé !" });
      } catch (error) {
        res.status(400).json({ error: error });
      }
    } else if (like == -1) {
      try {
        await Sauce.updateOne(
          { _id: req.params.id },
          { $inc: { dislikes: +1 }, $push: { usersDisliked: userId } }
        );
        res.status(200).json({ message: "Dislike confirmé !" });
      } catch (error) {
        res.status(400).json({ error: error });
      }
    } else if (like == 0) {
      const sauce = await Sauce.findOne({ _id: req.params.id });
      const userAlreadyLiked = sauce.usersLiked.includes(userId);
      const userAlreadyDisliked = sauce.usersDisliked.includes(userId);

      if (userAlreadyLiked) {
        try {
          await Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { likes: -1 }, $pull: { usersLiked: userId } }
          );
          res.status(200).json({ message: "Like annulé !" });
        } catch (error) {
          res.status(400).json({ error: error });
        }
      }
      if (userAlreadyDisliked) {
        try {
          await Sauce.updateOne(
            { _id: req.params.id },
            { $inc: { dislikes: -1 }, $pull: { usersDisliked: userId } }
          );
          res.status(200).json({ message: "Dislike annulé !" });
        } catch (error) {
          res.status(400).json({ error: error });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// Exportation des middlewares
exports.createSauce = createSauce;
exports.getOneSauce = getOneSauce;
exports.modifySauce = modifySauce;
exports.deleteSauce = deleteSauce;
exports.getAllSauces = getAllSauces;
exports.likeAndDislikeSauce = likeAndDislikeSauce;
