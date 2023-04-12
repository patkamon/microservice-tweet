const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    // orderId: { type: String },
    userId: { type: String },
    // amount: { type: Number },
    // status: { type: String },
    tweet: [
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

module.exports = mongoose.model("order", OrderSchema);