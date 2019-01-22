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
        deck: Joi.number().required(),
        cards: Joi.array().items(
          Joi.object().keys({
            card: Joi.number().required(),
            reviewedAt: Joi.string().required(),
            leitnerBox: Joi.number().required(),
          }),
        ),
      }),
    )
    .required(),
  addCardProgress: {
    params: {
      deckId: Joi.number().required(),
      cardId: Joi.number().required(),
    },
    body: {
      leitnerBox: Joi.number().required(),
      reviewedAt: Joi.string().required(),
    },
  },
};
