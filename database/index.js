const Sequelize = require("sequelize");
const sqlite = require("sqlite3");
const DATABASE_PATH = "data/flashcards.db";
const db = new sqlite.Database(DATABASE_PATH);
// Initialize sequelize ORM for SQLite
const sequelize = new Sequelize(`sqlite:${DATABASE_PATH}`, { logging: false, operatorAliases: false });

module.exports = () => sequelize;

// TODO: Remove
// Mongoose code
const mongoose = require("mongoose");
const config = require("../config/index");

// module.exports = () => {

//   return sequelize;

//   mongoose.Promise = global.Promise;

//   if (!config.database.uri) {
//   	console.warn("DATABASE_URI environment variable not set.\nPlease set DATABASE_URI environment variable to run flashcards-for-developers");
//   	process.exit();
//   }

//   mongoose.connect(
//     config.database.uri,
//     { useNewUrlParser: true },
//   );

//   const database = mongoose.connection;

//   database.on("error", console.error.bind(console, "MongoDB connection error"));

//   return database;
// };
