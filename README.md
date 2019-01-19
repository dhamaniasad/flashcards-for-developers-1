# flashcards for classes

**flashcards for classes** is the fork of [flashcards-for-developers](https://github.com/nlaz/flashcards-for-developers) that teachers can use to manage the classes with flashcards.

## Installing

Clone this project and update your path:

```sh
$ git clone https://github.com/t-cool/flashcards-for-classes
$ cd flashcards-for-classes
```

Install dependencies:

```sh
$ yarn install
```

## Usage

start the app:

```sh
$ yarn web
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Syncing with local JSON files

You can also sync the database with content from JSON files. The sample syntax for the JSON files is shown in the `data_sample` folder.

**Usage:**

First put your JSON files into the `data` folder. The files will be ignored by Git. Then run the script below.

```bash
node scripts/seed_db_locally.js
```

Note that running the script will **OVERWRITE** the records in the database. The database can be changed through environment variables. The default environment is `development`.

## Data Schema

### Hierarchy
- Collections
	- Decks
		- Cards

Please refer to the `data_sample` directory for schema reference. 

### Relationships

#### Collections
Collections hold references to decks that belong to the collection in an key `decks` which is an array. The items in the array are of type `mongoose.Types.ObjectId`.

#### Decks
Cards hold a reference to the deck they belong to in the key `deck` of type `mongoose.Types.ObjectId`.

#### Cards
Cards hold a reference to the deck they belong to in the key `deck` of type `mongoose.Types.ObjectId`.

## Credit

- This repository is made from [flashcards-for-developers](https://github.com/nlaz/flashcards-for-developers) of [nlaz](https://github.com/nlaz)'s work. 

- [Asad Dhamani](https://github.com/dhamaniasad) 
customized [flashcards-for-developers](https://github.com/nlaz/flashcards-for-developers) and make this English flashcards version. I really appreciate his cooperation for this work.

## License

This project is [MIT licensed](./LICENSE.md).
