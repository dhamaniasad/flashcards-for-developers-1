# Flashcards For Developers

> "That's how knowledge works. It builds up, like compound interest." - Warren Buffett

This project contains a small site for studying developer flashcards. This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and it may be useful to refer to its [User Guide](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Installing

Clone this project and update your path:

```sh
git clone git@github.com:nlaz/flashcards-for-developers.git
cd flashcards-for-developers
```

Install dependencies and run the web application and server application seperately.

Before starting the app, don't forget to set your `NODE_ENV` environment variable.

```bash
export NODE_ENV=development
```

```sh
yarn install
yarn web
yarn server  # in a separate window
```

Open [http://localhost:3000/](http://localhost:3000/) to view the app in the browser.

### Configuration

All configuration options can be passed to the server using environment variables. The following variables are supported:

- `PORT` - The port on which the server will listen to requests (Default: 3000)
- `DATABASE_URI` - The uri of the database used to store data

Environment variables are set by adding files like `.env` which should not be checked into source control. Additional `.env` files can be used:

- `.env`: Default.
- `.env.local`: Local overrides. **This file is loaded for all environments except test.**
- `.env.development`, `.env.test`, `.env.production`: Environment-specific settings.
- `.env.development.local`, `.env.test.local`, `.env.production.local`: Local overrides of environment-specific settings.

For more information check the [`create-react-app` docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#adding-development-environment-variables-in-env).

## Database Migrations

You need to run database migrations to bring the database schema up to date with the current state of the project. You can use the following command to run the migrations:

```bash
node_modules/.bin/sequelize db:migrate
```

#### Note: It's generally a good idea to run the above command anytime you pull some changes from the repo, just in case the schema has changed.

## Available Scripts

In the project directory, you can run:

### `yarn web`

Runs the frontend side of the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `yarn server`

Runs the server side of the app in the development mode.<br>
Make API requests to [http://localhost:5000](http://localhost:5000) to interact with the server.

The server will also reload if you make edits.<br>
_Note:_ It also initially loads the built React app on the server at [http://localhost:5000](http://localhost:5000)

### `yarn test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `yarn build`

Builds the React app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `yarn deploy`

Builds the React app for production and runs the server so the the app is ready to be deployed.

## Syncing with local CSV files

You can sync the database with content from CSV files. The sample syntax for the CSV files is shown in the `data_sample` folder.

**Usage:**

First put your CSV files into the `data` folder. The files will be ignored by Git.

```bash
cp data_sample/*.csv data/
```

Then run the script below.

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
You can copy the sampel data from 

### Relationships

#### Collections
Collections hold references to decks that belong to the collection in an key `decks` which is a JSON array.

#### Decks
Cards hold a reference to the deck they belong to in the key `deck` of type `Integer ForeignKey`.

#### Cards
Cards hold a reference to the deck they belong to in the key `deck` of type `Integer ForeignKey`.

## Contributing

Interested in contributing? Contact [@nlaz](https://github.com/nlaz) for help to get started.

## License

This project is [MIT licensed](./LICENSE.md).
