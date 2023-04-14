const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RetweetSchema = new Schema(
  {
    userId: { type: String },
    _id: { type: String, require: true },
    id: { type: String, require: true },
    msg: { type: String },
    like_count: { type: Number },
    like: [{ type: String }],
    comment: [
      {
        userId: { type: String },
        msg: { type: String },
        createdAt: { type: Date },
      },
    ],
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
