const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  github_id: { type: String, required: true, unique: true },
  avatar_url: { type: String },
  customerId: { type: String, select: false },
  user_plan: { type: String, enum: ["free", "pro_monthly"], default: "free" },
  email_notification: { type: Boolean },

  // Extensions of the user model
  saved_decks: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deck" }],
    default: [],
    select: false,
  },
  study_sessions: {
    type: [String],
    default: [],
    select: false,
  },
});

UserSchema.set("toJSON", {
  virtuals: true,
});

// Added to prevent mongoose deprecation errors
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

module.exports = mongoose.model("User", UserSchema);
