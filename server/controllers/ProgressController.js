const Joi = require("joi");

const User = require("../models/User");
const DeckProgress = require("../models/DeckProgress");
const CardProgress = require("../models/CardProgress");
const ReviewEvent = require("../models/ReviewEvent");
const Card = require("../models/Card");

const progressSchemas = require("./validation/progress");
const _ = require("lodash");

module.exports.getStudyProgress = async (req, res, next) => {
  try {
    await Joi.validate(req.user, progressSchemas.user);

    const deckProgress = await DeckProgress.findAll({ where: { user: req.user } });

    let _deckProgress = [];

    for (var i = 0; i < deckProgress.length; i++) {
      let cards = await deckProgress[i].getCards();
      let data = deckProgress[i];
      _deckProgress.push({ ...data.dataValues, cards });
    }

    res.send(_deckProgress);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserStudyProgress = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username } });
    let deckProgress = await DeckProgress.findAll({ where: { user: user._id } });

    let progress = [];

    for (var i = 0; i < deckProgress.length; i++) {
      let deck = deckProgress[i];
      let deckData = deck.dataValues;
      let cards = await deck.getCards();
      let doc = { ...deckData, cards: cards };
      progress.push(doc);
    };

    res.send(progress);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.addStudyProgress = async (req, res, next) => {
  try {
    const { user } = req;
    const progressObjs = req.body;

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.body, progressSchemas.addStudyProgress);

    const studyProgresses = await Promise.all(
      progressObjs.map(async deckObj => {
        const cardProgresses = await Promise.all(
          deckObj.cards.map(async cardObj => {
            return await CardProgress.findOneAndUpdate(
              { card: cardObj.card, user: user },
              { leitnerBox: cardObj.leitnerBox, reviewedAt: cardObj.reviewedAt },
              { new: true, upsert: true },
            );
          }),
        );

        const deckProgress = await DeckProgress.findOneAndUpdate(
          { deck: deckObj.deck, user: user },
          { $addToSet: { cards: cardProgresses } },
          { new: true, upsert: true },
        ).populate("cards");

        return deckProgress;
      }),
    );

    res.send(studyProgresses);
  } catch (error) {
    next(error);
  }
};

module.exports.getDeckProgress = async (req, res, next) => {
  try {
    const { deckId } = req.params;

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.params, progressSchemas.getDeckProgress.params);
    
    let deckProgress = await DeckProgress.findOne({
      where: {
        deck: deckId,
        user: req.user,
      }
    });

    let cards;

    if (deckProgress) {
      cards = await deckProgress.getCards();
    } else {
      deckProgress = { dataValues: { } };
      cards = [];
    }

    res.send({ ...deckProgress.dataValues, cards: cards });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.addCardProgress = async (req, res, next) => {
  try {
    const { user } = req;
    const { deckId, cardId } = req.params;
    let { leitnerBox, reviewedAt } = req.body;
    reviewedAt = new Date(reviewedAt);

    await Joi.validate(req.user, progressSchemas.user);
    await Joi.validate(req.params, progressSchemas.addCardProgress.params);
    await Joi.validate(req.body, progressSchemas.addCardProgress.body);

    // Sequelize requires _id to be provided on upsert or it creates a new document
    let existingCardProgress = await CardProgress.findOne({ where: { card: cardId, user: user } });

    let cardProgressDocToUpsert = {
       card: cardId, user: user, leitnerBox: leitnerBox, reviewedAt: reviewedAt 
    };

    if (existingCardProgress) {
      cardProgressDocToUpsert._id = existingCardProgress._id;
    }

    let cardProgress = await CardProgress.upsert(
      cardProgressDocToUpsert
    );

    // SQLite upsert does not return document if its created, only when updated, hence we need to do this
    cardProgress = await CardProgress.findOne({ where: { card: cardId, user: user, reviewedAt: reviewedAt } });

    let existingDeckProgress = await DeckProgress.findOne({ where: { deck: deckId, user: user } });

    let deckProgressDocToUpsert = {
      deck: deckId, user: user
    }

    if (existingDeckProgress) {
      deckProgressDocToUpsert._id = existingDeckProgress._id;

      let __cards = existingDeckProgress.__cards;
      __cards.push(cardProgress._id);

      deckProgressDocToUpsert.__cards = _.uniq(__cards);
    } else {
      deckProgressDocToUpsert.__cards = [cardProgress._id];
    }

    let deckProgress = await DeckProgress.upsert(
      deckProgressDocToUpsert
    );

    deckProgress = await DeckProgress.findOne({ where: { deck: deckId, user: user } });

    let cards;

    if (deckProgress) {
      cards = await deckProgress.getCards();
    } else {
      deckProgress = { dataValues: { } };
      cards = [];
    }

    // Log review event
    await ReviewEvent.create({ user: user, card: cardId });

    res.send({ ...deckProgress.dataValues, cards });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getStudyStats = async (req, res, next) => {
  let cards = await Card.findAll();
  let times = await ReviewEvent.findAll();
  res.send({ cards: cards.length, times: times.length });
}
