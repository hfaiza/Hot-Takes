// Importation des modules nécessaires
const http = require("http");
const app = require("./app");

// Pour que l'application tourne sur le port spécifié
app.set("port", process.env.PORT);

// Création du serveur
const server = http.createServer(app);

// Pour que le serveur écoute le port spécifié
server.listen(process.env.PORT);
