const Joi = require("joi");
const Collection = require("../models/Collection");

const collectionSchemas = require("./validation/collections");

module.exports.getCollections = async (req, res, next) => {
  try {
    const { search } = req.query;

    console.log(req.query);

    await Joi.validate(req.query, collectionSchemas.getCollections);

    const collections = search
      ? await Collection.findAll({ where: { name: search } })
      : await Collection.findAll({ where: {} });

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

    const collection = await Collection.findOne({ where: { _id: collectionId } }).populate("decks");
    res.send(collection);
  } catch (error) {
    next(error);
  }
};
