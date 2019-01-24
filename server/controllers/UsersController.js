const Joi = require("joi");
const axios = require("axios");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");
const Stripe = require("stripe");

const streaks = require("../utils/streaks");
const User = require("../models/User");
const Deck = require("../models/Deck");
const CardProgress = require("../models/CardProgress");
const ReviewEvent = require("../models/ReviewEvent");
const userSchemas = require("./validation/users");
const config = require("../../config/index");

const GITHUB_OAUTH_ROUTE = "https://github.com/login/oauth/access_token";
const GITHUB_USER_ROUTE = "https://api.github.com/user";
const MAILCHIMP_ROUTE = "https://us17.api.mailchimp.com";
const MEMBERSHIP_LIST = "6aa2bb18b4";
const SUBSCRIPTION_PLAN = "pro_monthly";
const registerUser = require("../utils/registerUser");
const loginUser = require("../utils/loginUser");
const sequelize = require("../../database/index")();
const _ = require("lodash");

const stripe = Stripe(config.stripePrivateKey);

module.exports.getGithubUser = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.getGithubUser);

    // Request access token
    const response = await axios.post(GITHUB_OAUTH_ROUTE, {
      code: req.body.code,
      client_id: config.githubOAuthClientId,
      client_secret: config.githubOAuthClientSecret,
    });

    const auth = queryString.parse(response.data);

    // Request user profile object
    const opts = { headers: { Authorization: `token ${auth.access_token}` } };
    const { data } = await axios.get(GITHUB_USER_ROUTE, opts);

    let user = await User.findOne({ github_id: data.id });

    if (!user) {
      return res.status(403).json({
        message: "User not found. Please provide required fields.",
        profile: {
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url,
          github_id: data.id,
          username: data.login,
        },
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      config.sessionSecret,
    );

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.createGithubUser = async (req, res, next) => {
  try {
    const { email, name, avatar_url, github_id, username, email_notification } = req.body;

    await Joi.validate(req.body, userSchemas.createGithubUser);

    const user = await User.create({
      email,
      name,
      avatar_url,
      github_id,
      email_notification,
      username,
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, name: user.name },
      config.sessionSecret,
    );

    // Subscribe user to membership list
    if (email_notification) {
      const route = `${MAILCHIMP_ROUTE}/3.0/lists/${MEMBERSHIP_LIST}/members/`;
      const auth = { username: "mailchimp", password: config.mailchimpApiKey };
      const query = { email_address: email, status: "subscribed" };
      try {
        await axios.post(route, query, { auth });
      } catch (error) {
        console.log("❌ 📨 Email list - ", error.message);
      }
    }

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;

    await Joi.validate(req.body, userSchemas.createUser);

    const user = await registerUser(name, email, username, password);

    const token = jwt.sign(
      { id: user._id, username: user.username, name: user.name },
      config.sessionSecret
    );

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await Joi.validate(req.body, userSchemas.loginUser);

    const user = await loginUser(email, password);

    if (!user) {
      return res.status(403).json({
        message: "User not found. Please provide required fields.",
        profile: {
          email: user.email,
          username: user.username,
        },
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name },
      config.sessionSecret,
    );

    res.set("Authorization", `Bearer ${token}`);
    res.send(user);

  } catch (error) {
    next(error);
  }
};

module.exports.postStripeCharge = async (req, res, next) => {
  try {
    const { source } = req.body;

    const user = await User.findOne({ _id: req.user });
    const customer = await stripe.customers.create({
      email: user.email,
      source: source,
    });

    await stripe.subscriptions.create({
      customer: customer.id,
      plan: SUBSCRIPTION_PLAN,
    });

    // Add customer Id to user model
    const newUser = await User.findOneAndUpdate(
      { _id: req.user },
      { $set: { customerId: customer.id, user_plan: SUBSCRIPTION_PLAN } },
      { new: true },
    );

    res.send({ message: "Success!", user: newUser });
  } catch (error) {
    next(error);
  }
};

module.exports.getPinnedDecks = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { _id: req.user } });

    let decks = await user.saved_decks();

    res.send(decks);
  } catch (error) {
    next(error);
  }
};

module.exports.addPinnedDecks = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.addPinnedDecks);

    const { decks } = req.body;

    let _user = await User.findOne({ where: { _id: req.user } });

    let _decks = _.uniq(_.concat(_user.__saved_decks, decks));

    const user = await User.update(
      { __saved_decks: _decks },
      { where: { _id: req.user } },
    );

    await _user.reload();

    let userDecks = await _user.saved_decks();

    res.send(userDecks);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.removePinnedDeck = async (req, res, next) => {
  try {
    await Joi.validate(req.body, userSchemas.removePinnedDeck);

    const { deck } = req.body;

    let _user = await User.findOne({ where: { _id: req.user } });

    let _decks = _.uniq(_.pull(_user.__saved_decks, deck));

    const user = await User.update(
      { __saved_decks: _decks },
      { where: { _id: req.user } },
    );

    await _user.reload();

    let userDecks = await _user.saved_decks();

    res.send(userDecks);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.addStudySessions = async (req, res, next) => {
  try {
    const { dates } = req.body;

    await Joi.validate(req.body, userSchemas.addStudySessions);

    const fmtDates = dates.map(el => moment(el).format());

    let user = await User.findOne({ where: { _id: req.user } });

    let __study_sessions = user.__study_sessions;
    __study_sessions.push(fmtDates);

    __study_sessions = _.uniq(_.flatMap(__study_sessions));

    user = await User.update(
      { __study_sessions: __study_sessions },
      { where: { _id: req.user } }
    )

    user = await User.findOne({ where: { _id: req.user } });

    res.send(user.study_sessions);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getStudySessions = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { _id: req.user } });

    res.send(user.study_sessions);
  } catch (error) {
    next(error);
  }
};

module.exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { _id: req.user } });

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email, email_notification, username } = req.body;

    await Joi.validate(req.body, userSchemas.updateUserProfile);

    const user = await User.findOneAndUpdate(
      { _id: req.user },
      { $set: { name, email, email_notification, username } },
      { new: true },
    );

    res.send(user);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteProfile = async (req, res, next) => {
  try {
    await User.deleteOne({ _id: req.user });

    await Deck.updateMany({ author: req.user }, { $set: { status: "private" } });

    res.send({ message: "Success! Account deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });
    const profile = {
      avatar_url: undefined,
      name: user.name,
      id: user._id,
      username: user.username,
    };

    await Joi.validate(profile, userSchemas.userProfile);

    res.send(profile);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserReviews = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ where: { username } });

    const reviews = await sequelize.query(
      `SELECT    DATE(createdAt) AS '_id',
       COUNT(*) AS 'count'
       FROM      reviewevent
       WHERE user = ${user._id}
       GROUP BY  DATE(createdAt)`
    );

    res.send(reviews[0]);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getUserPinnedDecks = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: { username } });

    const saved_decks = await user.saved_decks();

    res.send(saved_decks);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserActivity = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ where: {username } });
    const reviews = await ReviewEvent.findAll({ where: { user: user._id } });
    const studyDates = [...new Set(reviews.map(el => moment(el.createdAt).format("YYYY-DD-MM")))];
    const cardProgresses = await CardProgress.findAll({ where: { user: user._id } });
    const masteredCards = await CardProgress.findAll({ where: { user: user._id, leitnerBox: { $gt: 5 } } });

    const currentStreak = streaks.getCurrentStreak(studyDates);
    const longestStreak = streaks.getLongestStreak(studyDates);

    res.send({
      cards_seen: cardProgresses.length,
      mastered_cards: masteredCards.length,
      current_streak: currentStreak,
      longest_streak: longestStreak,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
