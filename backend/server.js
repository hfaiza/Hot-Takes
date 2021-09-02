// Importation du module HTTP
const http = require("http");

// Importation de l'application
const app = require("./app");

// Pour que l'application tourne sur le port spécifié
app.set("port", process.env.PORT);

// Création du serveur
const server = http.createServer(app);

// Pour que le serveur écoute le port spécifié
server.listen(process.env.PORT);

// Si le rejet d'une promesse n'est pas géré
process.on("unhandledRejection", (reason, promise) => {
  console.log(`Unhandled Rejection at: ${promise}\n` + `Reason: ${reason}`);
});

// Si une exception n'est ni attrapée ni traitée
process.on("uncaughtException", (err, origin) => {
  console.log(`Error: ${err}\n` + `Origin: ${origin}`);
});
