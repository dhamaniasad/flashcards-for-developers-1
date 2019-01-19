const mongoose = require("mongoose");

const Card = require("../server/models/Card");
const Deck = require("../server/models/Deck");
const config = require("../config/index");

require("../database/index")();
mongoose.set("useFindAndModify", false);

// Load collections data from JSON file
const collectionsSeedData = require("../data/cards.json");

const fetchCards = async () => {
  const results = collectionsSeedData;
  return results;
};

// Creates copy of record in the database
const writeCardsToDatabase = async cards => {

  for (const card of cards) {
    const deck = (await Deck.findOne({
      _id: mongoose.Types.ObjectId(card.deck)
    })) || {};
    const {
      deckAirtableId,
      ...rest
    } = card;
    await Card.findOneAndUpdate({
      airtableId: card.airtableId
    }, { ...rest,
      deck: deck._id
    }, {
      upsert: true
    }, );
  }

  return await Card.countDocuments();
};

async function sync_cards_to_database() {
  try {
    const cards = await fetchCards();

    const cardsCount = await writeCardsToDatabase(cards);

    console.log("Success! Number of cards written: ", cardsCount);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

module.exports = sync_cards_to_database