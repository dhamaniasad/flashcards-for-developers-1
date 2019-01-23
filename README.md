# flashcards for teachers

Using **flashcards for teachers** makes it possible to manage English classes with flashcards.  You can check students' understanding by checking the progress of their flashcards.

**flashcards for teachers** derives from [flashcards for developers](https://github.com/nlaz/flashcards-for-developers).  The system has been customized to meet the needs of English education in Japan.

## Installing

Clone this project and update your path:

```sh
$ git clone https://github.com/t-cool/flashcards-for-teachers
$ cd flashcards-for-teachers
```

Install dependencies:

```sh
$ yarn install
```

## Usage

start the backend server:

```sh
$ yarn server
```

Open a new Terminal and start the frontend server:

```sh
$ yarn web
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Syncing with local JSON files

You can also sync the database with content from JSON files. The sample syntax for the JSON files is shown in the `data` folder.

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

Please refer to the `data` directory for schema reference. 

### Relationships

#### Collections
Collections hold references to decks that belong to the collection in an key `decks` which is an array. The items in the array are of type `mongoose.Types.ObjectId`.

#### Decks
Cards hold a reference to the deck they belong to in the key `deck` of type `mongoose.Types.ObjectId`.

#### Cards
Cards hold a reference to the deck they belong to in the key `deck` of type `mongoose.Types.ObjectId`.

## Credit

- This repository is made from nlaz's [flashcards-for-developers](https://github.com/nlaz/flashcards-for-developers). 

- [Asad Dhamani](https://github.com/dhamaniasad) 
customized [flashcards-for-developers](https://github.com/nlaz/flashcards-for-developers) and make this English flashcards version. I really appreciate his cooperation for this work.

## License

This project is [MIT licensed](./LICENSE.md).
