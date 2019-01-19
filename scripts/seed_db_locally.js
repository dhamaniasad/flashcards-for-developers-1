const loadCollections = require("./load_local_collections.js");
const loadDecks = require("./load_local_decks.js");
const loadCards = require("./load_local_cards.js");

async function runImport() {
	// This load order is important to preserve foreign key references - DO NOT CHANGE
	await loadDecks();
	await loadCards();
	await loadCollections();
	process.exit();
}

// Run all imports
runImport();
