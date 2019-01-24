const Deck = require("../server/models/Deck");
const Collection = require("../server/models/Collection");
const config = require("../config/index");
const neatCsv = require('neat-csv');
const fs = require("fs");
const _ = require("lodash");

require("../database/index")();

// Load collections data from CSV file
const fetchCollections = async () => {
  let csvData = fs.readFileSync("data_sample/collections.csv", "utf8");
  const results = await neatCsv(csvData);
  return results;
};

// Creates copy of record in the database
const writeCollectionsToDatabase = async (collections, deckIds) => {

  for (var i = 0; i < collections.length; i++) {

    let collection = collections[i];

    if (collection._id) {
      collection._id = parseInt(collection._id);
    }

    let decks;

    if (collection.__decks) {
      decks = _.split(collection.__decks, ",");
    }

    decks = _.map(decks, (deck) => parseInt(deck));

    // Some decks attached to the collection are not in the database
    let missingDecks = _.difference(decks, deckIds);
    if (missingDecks.length > 0) {
      throw new Error(`__decks ids ${missingDecks} from row at line ${i+2} do not exist in database. Exiting...`);
    }

    try {
      let res = await Collection.upsert(collection);
      collection._id ? "" : console.log(`New Collection created from row at line ${i+2} because of missing _id column.`);
    } catch (err) {
      console.error(err);
    }
  }

  return collections.length;
};

async function sync_collections_to_database() {
  try {

    const decks = await Deck.findAll();
    const deckIds = _.map(decks, (deck) => deck._id);

    const collections = await fetchCollections();

    const collectionCount = await writeCollectionsToDatabase(collections, deckIds);

    console.log("Success! Number of collections written: ", collectionCount);
    process.exit();
  } catch (error) {
    console.log(error);
  }
}

module.exports = sync_collections_to_database;

if (require.main === module) {
  sync_collections_to_database();  
}
