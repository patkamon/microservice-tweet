const mongoose = require("mongoose");
// const { stringifyVariables } = require("urql");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: String,
    username: String,
    password: String,
    salt: String,
    phone: String,
    profile: [{ type: Schema.Types.ObjectId, ref: "profile", require: true }],
    tweet: [{ _id: { type: String, require: true } }],
    retweet: [{ _id: { type: String, require: true } }],
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.salt;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

module.exports = mongoose.model("user", UserSchema);
