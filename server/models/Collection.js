const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();
const Deck = require("./Deck");

const Collection = sequelize.define("collections", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING },
  emoji: { type: Sequelize.STRING },
  color: { type: Sequelize.STRING },
  order: { type: Sequelize.INTEGER, defaultValue: 1 },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  __decks: { type: Sequelize.JSON, defaultValue: [] }
});

Collection.prototype.getDecks = async function () {
  var _decks = this.__decks || [];
  var decks = await Deck.findAll({ where: {_id: {$in: _decks} } });

  let decksRes = [];

  for (var i = 0; i < decks.length; i++) {
    let deck = decks[i];
    let cards = await deck.getCards();
    decksRes.push({ ...deck.dataValues, cards: cards });
  }

  return decksRes;
};

module.exports = Collection;




// TODO: REMOVE
const mongoose = require("mongoose");

const CollectionSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    airtableId: { type: String, index: true },
    decks: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }], select: false },
    emoji: String,
    color: String,
    order: Number,
  },
  {
    timestamps: true,
  },
);

CollectionSchema.set("toJSON", {
  virtuals: true,
});

mongoose.set("useCreateIndex", true);
// module.exports = mongoose.model("Collection", CollectionSchema);
