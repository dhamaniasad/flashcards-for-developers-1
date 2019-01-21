const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  getCardsQuery: {
    deck: Joi.number(),
    collection: Joi.string(),
    deckIds: [Joi.number(), Joi.array().items(Joi.number())],
  },
  createCard: {
    deck: Joi.number().required(),
    front: Joi.string(),
    back: Joi.string().allow(""),
  },
  deleteCard: {
    cardId: Joi.number().required(),
  },
  proUser: Joi.string()
    .valid("pro_monthly")
    .required(),
};