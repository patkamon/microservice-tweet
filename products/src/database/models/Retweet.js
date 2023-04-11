const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RetweetSchema = new Schema({
  userId: { type: String },
  _id: { type: String, require: true },
  id: { type: String, require: true },
  msg: { type: String },
});

module.exports = mongoose.model("retweet", RetweetSchema);
