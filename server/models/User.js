const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();
const Deck = require("./Deck");

const User = sequelize.define("users", {
  _id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false },
  username: { type: Sequelize.STRING, allowNull: false },
  github_id: { type: Sequelize.STRING, allowNull: false },
  avatar_url: Sequelize.STRING,
  customerId: Sequelize.STRING,
  user_plan: { type: Sequelize.STRING, allowNull: false, defaultValue: "pro_monthly" },
  email_notifications: { type: Sequelize.BOOLEAN, defaultValue: false },
  password: { type: Sequelize.STRING, allowNull: false },
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
  __saved_decks: { type: Sequelize.JSON, defaultValue: []},
  __study_sessions: { type: Sequelize.JSON, defaultValue: []},
  study_sessions: { type: Sequelize.VIRTUAL, get() { return this.__study_sessions; } }
});

User.prototype.saved_decks = async function () {
  var _saved_decks = this.__saved_decks;
  var decks = await Deck.findAll({where: {_id: {$in: _saved_decks}, deleted: false }});
  var resDecks = [];
  for (var i = 0; i < decks.length; i++) {
    let deck = decks[i];
    let cards = await deck.getCards();
    resDecks.push({ ...deck.dataValues, cards: cards });
  }
  return resDecks;
}

module.exports = User;

// TODO: REMOVE
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  github_id: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  customerId: { type: String, select: false },
  user_plan: { type: String, enum: ["free", "pro_monthly"], default: "free" },
  email_notification: { type: Boolean },
  // Extensions of the user model
  saved_decks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }],
    default: [],
    select: false,
  },
  study_sessions: {
    type: [String],
    default: [],
    select: false,
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
});

// Added to prevent mongoose deprecation errors
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

// module.exports = mongoose.model("User", UserSchema);
