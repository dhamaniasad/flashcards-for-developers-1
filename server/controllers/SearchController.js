const Joi = require("joi");

const Deck = require("../models/Deck");
const searchSchemas = require("./validation/search");

const escapeRegex = text => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports.searchContent = async (req, res, next) => {
  try {
    let { text } = req.query;
    text = text ? ("%" + text + "%") : "%";

    await Joi.validate(req.query, searchSchemas.searchContent);

    const status = { $ne: "private" }; // hide private
    const regex = new RegExp(escapeRegex(text), "gi");
    const query = { $or: { name: {$like: text}, description: {$like: text} } };

    const decks = await Deck.findAll({ where: { ...query } }, { limit: 10 });

    res.send(decks);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
