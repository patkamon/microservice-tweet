const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RetweetSchema = new Schema(
  {
    userId: { type: String },
    _id: { type: String, require: true },
    id: { type: String, require: true },
    msg: { type: String },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("retweet", RetweetSchema);
