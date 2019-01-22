const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const ReviewEvent = sequelize.define("reviewevent", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  user: { type: Sequelize.INTEGER, references: { model: { tableName: "users" }, key: "_id" } },
  card: { type: Sequelize.INTEGER, references: { model: { tableName: "cards" }, key: "_id" } },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE
}, {
  freezeTableName: true
});

module.exports = ReviewEvent;




// TODO: REMOVE
const mongoose = require("mongoose");

const ReviewEventSchema = new mongoose.Schema(
  {
    card: { type: mongoose.Schema.Types.ObjectId, ref: "Card" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  },
);

// module.exports = mongoose.model("ReviewEvent", ReviewEventSchema);
