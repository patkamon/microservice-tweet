const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  userId: { type: String },
  _id: { type: String, require: true },
  msg: { type: String },
});

module.exports = mongoose.model("tweet", TweetSchema);
