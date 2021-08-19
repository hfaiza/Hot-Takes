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

// Exportation des middlewares
exports.createSauce = createSauce;
exports.getOneSauce = getOneSauce;
exports.modifySauce = modifySauce;
exports.deleteSauce = deleteSauce;
exports.getAllSauces = getAllSauces;
