const Sequelize = require('sequelize');
const sequelize = require("../../database/index")();

const DeckProgress = sequelize.define("deckprogress", {
	_id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	deck: {
		type: Sequelize.INTEGER,
		references: {
			model: {
				tableName: "decks"
			},
			key: "_id"
		}
	},
	author: {
		type: Sequelize.INTEGER,
		references: {
			model: {
				tableName: "users"
			},
			key: "_id"
		}
	},
	__cards: {
		type: Sequelize.JSON,
		defaultValue: []
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE
});

module.exports = DeckProgress;



// TODO: REMOVE
const mongoose = require("mongoose");

const DeckProgressSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	deck: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Deck"
	},
	cards: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "CardProgress"
	}],
});

// module.exports = mongoose.model("DeckProgress", DeckProgressSchema);