const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const Deck = sequelize.define("decks", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  author: { type: Sequelize.INTEGER, references: { model: { tableName: "users" }, key: "_id" } },
  cards: Sequelize.JSON,  // SQLite does not support Array
  status: { type: Sequelize.STRING, defaultValue: "public", allowNull: false, validate: {isIn: [["public", "private"]]} },
  name: { type: Sequelize.STRING, allowNull: false },
  type: { type: Sequelize.STRING, allowNull: false, defaultValue: "Self graded" },
  source: { type: Sequelize.STRING },
  description: { type: Sequelize.STRING },
  difficulty: Sequelize.JSON, // SQLite does not support Array datatype natively
  stars: Sequelize.INTEGER,
  createdTime: Sequelize.DATE,
  upvotes: Sequelize.INTEGER,
  downvotes: Sequelize.INTEGER,
  new: Sequelize.BOOLEAN,
  pro: { type: Sequelize.BOOLEAN },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
});

module.exports = Deck;

// TODO: REMOVE
const mongoose = require("mongoose");

const DeckSchema = new mongoose.Schema(
  {
    airtableId: { type: String, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    status: { type: String, enum: ["private", "public"], default: "public" },
    name: String,
    type: { type: String, default: "Self graded" },
    source: String,
    description: String,
    difficulty: [String],
    stars: Number,
    createdTime: String,
    upvotes: Number,
    downvotes: Number,
    new: Boolean,
    pro: Boolean,
  },
  {
    timestamps: true,
  },
);

DeckSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
// module.exports = mongoose.model("Deck", DeckSchema);
