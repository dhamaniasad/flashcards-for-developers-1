const Joi = require("joi");
const Collection = require("../models/Collection");

const collectionSchemas = require("./validation/collections");
const _ = require("lodash");

module.exports.getCollections = async (req, res, next) => {
  try {
    const { search } = req.query;

    console.log(req.query);

    await Joi.validate(req.query, collectionSchemas.getCollections);

    const collections = search
      ? await Collection.findAll({ where: { name: search } })
      : await Collection.findAll({ where: {} });
      // TODO: FIX
    // const collections = search
    //   ? await Collection.find({ name: search }).populate("decks")
    //   : await Collection.find({ hidden: { $ne: true } });

    res.send(collections);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;

    await Joi.validate(req.params, collectionSchemas.getCollection);

    // const collection = await Collection.findOne({ where: { _id: collectionId } }).populate("decks");
    const collection = await Collection.findOne({ where: { _id: collectionId } });
    let decks = await collection.getDecks();
    res.send({ ...collection.dataValues, decks: decks });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.createCollection = async (req, res, next) => {
  try {
    let { name, description, emoji, color } = req.body;
    // const user = await User.findOne({ where: {_id: req.user } });

    await Joi.validate({ ...req.body, color: color.replace("#", "") }, collectionSchemas.createCollection);
    // await Joi.validate(user.user_plan, deckSchemas.proUser);

    const collection = await Collection.create({ name, description, color, emoji });

    res.send(collection);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.toggleDeckInCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    let { deck, isInCollection } = req.body;

    await Joi.validate(req.body, collectionSchemas.toggleDeckInCollection);

    const collection = await Collection.findOne({ where: { _id: collectionId } });

    let decks = collection.__decks || [];
    
    if (isInCollection) {
      decks = _.uniq(_.pull(decks, deck));
    } else {
      decks = _.uniq(_.concat(decks, deck));
    }

    await Collection.update({ __decks: decks }, { where: { _id: collectionId } });

    res.send(true);

  } catch (error) {
    console.error(error);
    next(error);
  }
};

