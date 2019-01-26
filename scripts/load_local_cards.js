const Card = require("../server/models/Card");
const Deck = require("../server/models/Deck");
const User = require("../server/models/User");
const config = require("../config/index");
const neatCsv = require('neat-csv');
const fs = require("fs");
const _ = require("lodash");

require("../database/index")();

// Load collections data from CSV file
const fetchCards = async () => {
  let csvData = fs.readFileSync("data/cards.csv", "utf8");
  const results = await neatCsv(csvData);
  return results;
};

// Creates copy of record in the database
const writeCardsToDatabase = async (cards, userIds, deckIds) => {
  for (var i = 0; i < cards.length; i++) {
    let card = cards[i];

    if (card.author) {
      card.author = parseInt(card.author);
      if (userIds.indexOf(card.author) === -1) {
        throw new Error(`Provided author id ${card.author} on line ${i+2} does not exist in database. Exiting...`);
      }
    } else {
      throw new Error(`Required field author missing on line ${i+2}. Exiting...`);
    }

    if (card.deck) {
      card.deck = parseInt(card.deck);
      if (deckIds.indexOf(card.deck) === -1) {
        throw new Error(`Provided deck id ${card.deck} on line ${i+2} does not exist in database. Exiting...`);
      }
    } else {
      throw new Error(`Required field deck missing on line ${i+2}. Exiting...`);
    }

    if (card._id) {
      card._id = parseInt(card._id);
    }

    try {
      let res = await Card.upsert(card);
      card._id ? "" : console.log(`New Card created from row at line ${i+2}.`);
    } catch (err) {
      console.error(err);
    }
  }

  return cards.length;
};

async function sync_cards_to_database() {
  try {

    const users = await User.findAll();
    const userIds = _.map(users, (user) => user._id);

    const decks = await Deck.findAll();
    const deckIds = _.map(decks, (deck) => deck._id);

    const cards = await fetchCards();

    const cardsCount = await writeCardsToDatabase(cards, userIds, deckIds);

    console.log("Success! Number of cards written: ", cardsCount);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

module.exports = sync_cards_to_database

if (require.main === module) {
  sync_cards_to_database();  
}
