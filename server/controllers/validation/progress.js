const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

module.exports = {
  user: Joi.number().required(),
  getDeckProgress: {
    user: Joi.number().required(),
    params: {
      deckId: Joi.number().required(),
    },
  },
  addStudyProgress: Joi.array()
    .items(
      Joi.object().keys({
        deck: Joi.objectId().required(),
        cards: Joi.array().items(
          Joi.object().keys({
            card: Joi.objectId().required(),
            reviewedAt: Joi.string().required(),
            leitnerBox: Joi.number().required(),
          }),
        ),
      }),
    )
    .required(),
  addCardProgress: {
    params: {
      deckId: Joi.objectId().required(),
      cardId: Joi.objectId().required(),
    },
    body: {
      leitnerBox: Joi.number().required(),
      reviewedAt: Joi.string().required(),
    },
  },
};
