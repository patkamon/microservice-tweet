const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TweetsSchema = new Schema(
  {
    // tweetsId: { type: String },
    userId: { type: String },
    // amount: { type: Number },
    // status: { type: String },
    retweet: [
      {
        userId: String,
        _id: String,
        msg: String,
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

module.exports = mongoose.model("tweets", TweetsSchema);
