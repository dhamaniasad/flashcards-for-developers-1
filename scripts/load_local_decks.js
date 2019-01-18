const mongoose = require("mongoose");

const Deck = require("../server/models/Deck");
const Card = require("../server/models/Card");
const config = require("../config/index");

mongoose.set("useFindAndModify", false);

require("../database/index")();

const getDeckFromRecord = record => ({
  airtableId: record.id,
  name: record.get("Name"),
  description: record.get("Description"),
  airtableCards: record.get("Cards"),
  type: record.get("Type"),
  source: record.get("Source"),
  difficulty: record.get("Difficulty"),
  stars: record.get("Stars"),
  createdTime: record.get("Created time"),
  upvotes: record.get("Upvotes"),
  downvotes: record.get("Downvotes"),
  pro: record.get("Pro") || false,
  new: record.get("New") || false,
});

// Load decks data from JSON file
const decksSeedData = require("../data_sample/decks.json");

const fetchDecks = async () => {
  const results = decksSeedData;
  return results;
};

// Creates copy of record in the database
const writeDecksToDatabase = async decks => {

  for (const deck of decks) {
    await Deck.findOneAndUpdate({
        airtableId: deck.airtableId
      },
      deck, {
        upsert: true
      },
    );
  }

  return await Deck.countDocuments();
};

async function sync_decks_to_database() {
  try {
    const decks = await fetchDecks();

    const deckCount = await writeDecksToDatabase(decks);

    console.log("Success! Number of decks written: ", deckCount);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sync_decks_to_database;