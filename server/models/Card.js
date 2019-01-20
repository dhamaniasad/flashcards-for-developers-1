const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const Card = sequelize.define("cards", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  deck: { type: Sequelize.INTEGER, references: { model: { tableName: "decks" }, key: "_id" } },
  author: { type: Sequelize.INTEGER, references: { model: { tableName: "users" }, key: "_id" } },
  front: { type: Sequelize.TEXT, allowNull: false },
  back: { type: Sequelize.TEXT },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

module.exports = Card;




// TODO: REMOVE
const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema(
  {
    airtableId: { type: String, index: true },
    deck: { type: mongoose.Schema.Types.ObjectId, ref: "Deck" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    front: { type: String, required: true },
    back: String,
  },
  {
    timestamps: true,
  },
);

CardSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
// module.exports = mongoose.model("Card", CardSchema);
