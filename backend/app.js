const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");

require("dotenv").config();
const MONGODB_SECRET = process.env.MONGODB;

const app = express();

mongoose
  .connect(MONGODB_SECRET, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

app.use(express.json());

app.use("/api/auth", userRoutes);

module.exports = app;
