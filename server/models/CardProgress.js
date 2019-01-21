const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const CardProgress = sequelize.define("cardprogress", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  card: { type: Sequelize.INTEGER, references: { model: { tableName: "cards" }, key: "_id" } },
  user: { type: Sequelize.INTEGER, references: { model: { tableName: "users" }, key: "_id" } },
  reviewedAt: { type: Sequelize.DATE },
  leitnerBox: Sequelize.INTEGER,
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

module.exports = CardProgress;




// TODO: REMOVE
const mongoose = require("mongoose");

const CardProgressSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
  reviewedAt: { type: String },
  leitnerBox: { type: Number },
});

// module.exports = mongoose.model("CardProgress", CardProgressSchema);
