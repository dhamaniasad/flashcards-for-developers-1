const passport = require("./auth.js");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

function createNewUser(name, email, username, password, github_id="dhamaniasad") {

	let salt = bcrypt.genSaltSync(10);
	let hashed_password = bcrypt.hashSync(password, salt);

	delete password;  // Discard plaintext password as soon as we are done with it

	const new_user = User.build({
		name: name,
		email: email,
		username: username,
		github_id: github_id,
		password: hashed_password
	});
	new_user.save();

	return new_user;
}

module.exports = createNewUser;
