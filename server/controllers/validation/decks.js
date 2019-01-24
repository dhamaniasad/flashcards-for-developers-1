const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getDecksQuery: {
    collection: Joi.objectId(),
    ids: Joi.string(),
  },
  createDeck: {
    name: Joi.string().required(),
    description: Joi.string().allow(""),
  },
  getDeckParams: {
    deckId: Joi.number().required(),
  },
  updateDeck: {
    name: Joi.string().required(),
    description: Joi.string().allow(""),
  },
  deleteDeck: {
    deckId: Joi.number().required(),
  },
  proUser: Joi.string()
    .valid("pro_monthly")
    .required(),
  searchDecks: {
    search: Joi.string(),
  },
};
