const Deck = require("../server/models/Deck");
const Card = require("../server/models/Card");
const User = require("../server/models/User");
const config = require("../config/index");
const neatCsv = require('neat-csv');
const fs = require("fs");
const _ = require("lodash");

require("../database/index")();

// Load decks data from CSV file
const fetchDecks = async () => {
  let csvData = fs.readFileSync("data/decks.csv", "utf8");
  const results = await neatCsv(csvData);
  return results;
};

// Creates copy of record in the database
const writeDecksToDatabase = async (decks, userIds) => {

  for (var i = 0; i < decks.length; i++) {

    let deck = decks[i];

    if (deck.author) {
      deck.author = parseInt(deck.author);
      if (userIds.indexOf(deck.author) === -1) {
        throw new Error(`Provided author id ${deck.author} on line ${i+2} does not exist in database. Exiting...`);
      }
    } else {
      throw new Error(`Required field author missing on line ${i+2}. Exiting...`);
    }

    if (deck._id) {
      deck._id = parseInt(deck._id);
    }

    try {
      let res = await Deck.upsert(deck);
      deck._id ? "" : console.log(`New Deck created from row at line ${i+2} because of missing _id column.`);
    } catch (err) {
      console.error(err);
    }
  }

  return decks.length;
};

async function sync_decks_to_database() {
  try {

    const users = await User.findAll();
    const userIds = _.map(users, (user) => user._id);

    const decks = await fetchDecks();

    const deckCount = await writeDecksToDatabase(decks, userIds);

    console.log("Success! Number of decks written: ", deckCount);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sync_decks_to_database;

if (require.main === module) {
  sync_decks_to_database();  
}
