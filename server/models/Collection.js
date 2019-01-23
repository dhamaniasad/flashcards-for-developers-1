const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const Collection = sequelize.define("collections", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.STRING },
  emoji: { type: Sequelize.STRING },
  color: { type: Sequelize.STRING },
  order: { type: Sequelize.INTEGER, defaultValue: 1 },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  __decks: Sequelize.JSON
});

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
