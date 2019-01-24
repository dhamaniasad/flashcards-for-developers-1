const Joi = require("joi");

const Deck = require("../models/Deck");
const Card = require("../models/Card");
const User = require("../models/User");
const Collection = require("../models/Collection");
const deckSchemas = require("./validation/decks");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getDecks = async (req, res, next) => {
  try {
    let decks;
    const collectionId = req.query.collection;

    await Joi.validate(req.query, deckSchemas.getDecksQuery);

    if (collectionId) {
      const collection = await Collection.findOne({ where: { _id: collectionId } })
      decks = await collection.getDecks();
    } else {
      decks = await Deck.findAll({ where: {} });
    }

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

module.exports.createDeck = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const user = await User.findOne({ where: {_id: req.user } });

    await Joi.validate(req.body, deckSchemas.createDeck);
    await Joi.validate(user.user_plan, deckSchemas.proUser);

    const deck = await Deck.create({ name, description, status: "private", author: user._id });

    res.send(deck);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getDeck = async (req, res, next) => {
  try {
    await Joi.validate(req.params, deckSchemas.getDeckParams);

    const { deckId } = req.params;

    let deck = await Deck.findOne({ where: {_id: deckId, status: { $ne: "private" } } });

    if (!deck) {
      deck = await Deck.findOne({ where: { _id: deckId, author: req.user, status: "private" } });
    }

    let cards = await deck.getCards();

    res.send({ ...deck.dataValues, cards: cards });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.updateDeck = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    let { deckId } = req.params;
    deckId = parseInt(deckId);

    await Joi.validate(req.body, deckSchemas.updateDeck);

    const deck = await Deck.update(
      { name, description },
      { where: { _id: deckId, author: req.user } }
    );

    let updatedDeck = await Deck.findOne({ where: { _id: deckId } });

    res.send(updatedDeck);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.deleteDeck = async (req, res, next) => {
  try {
    const { deckId } = req.params;
    await Joi.validate(req.params, deckSchemas.deleteDeck);

    await Deck.destroy({ where: { _id: deckId, author: req.user } });

    await Card.destroy({ where: { deck: deckId, author: req.user } });

    res.send({ message: "Success! Deck removed." });
  } catch (error) {
    next(error);
  }
};

module.exports.getDecksForUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    let decks;

    const user = await User.findOne({ where: { username }});
    if (req.user !== user._id) {
      decks = await Deck.findAll({ where: { author: user._id, status: { $ne: "private" } } });
    } else {
      decks = await Deck.findAll({ where: { author: user._id } });
    }

    let resDecks = [];

    for (var i = 0; i < decks.length; i++) {
      let deck = decks[i];
      let cards = await deck.getCards();
      resDecks.push({ ...deck.dataValues, cards: cards });
    }

    res.send(resDecks);
  } catch (error) {
    next(error);
  }
};
