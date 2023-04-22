const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  name: String,
  desc: String,
  img: String,
  cover: String,
});

module.exports = mongoose.model("profile", ProfileSchema);
