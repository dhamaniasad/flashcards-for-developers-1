const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getCollections: {
    search: Joi.string(),
  },
  getCollection: {
    collectionId: Joi.number(),
  },
  createCollection: {
  	name: Joi.string().required(),
  	description: Joi.string(),
  	emoji: Joi.string().required(),
  	color: Joi.string().length(6).hex()
  },
  toggleDeckInCollection: {
    deck: Joi.number().required(),
    isInCollection: Joi.boolean().required()
  }
};
