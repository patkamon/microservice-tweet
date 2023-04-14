const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    userId: { type: String },
    tweet: [
      {
        userId: String,
        _id: String,
        msg: String,
        like_count: { type: Number },
        like: [{ type: String }],
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

module.exports = mongoose.model("order", OrderSchema);
