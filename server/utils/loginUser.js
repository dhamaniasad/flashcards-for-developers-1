const passport = require("./auth.js");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

async function loginUser(email, password) {

	const user = await User.findOne({where: {email: email}});

	if (!user) {
		return false;
	}

	let passwordCheck = bcrypt.compareSync(password, user.password);

	delete password;  // Discard plaintext password as soon as we are done with it

	if (passwordCheck) {
		return user;
	} 

	return false;
}

module.exports = loginUser;
