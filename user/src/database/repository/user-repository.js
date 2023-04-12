const mongoose = require("mongoose");
const { UserModel, ProfileModel } = require("../models");

//Dealing with data base operations
class UserRepository {
  async CreateUser({ email, password, phone, salt }) {
    const user = new UserModel({
      email,
      password,
      salt,
      phone,
      profile: [],
    });

    const userResult = await user.save();
    return userResult;
  }

  async CreateProfile({ _id, name, desc, img }) {
    const profile = await UserModel.findById(_id);

    if (profile) {
      const newAddress = new ProfileModel({
        name,
        desc,
        img,
      });

      await newAddress.save();

      profile.profile.push(newAddress);
    }

    return await profile.save();
  }

  async FindUser({ email }) {
    const existingUser = await UserModel.findOne({ email: email });
    return existingUser;
  }

  async FindUserById({ id }) {
    const existingUser = await UserModel.findById(id).populate("profile");
    // existingUser.cart = [];
    // existingUser.orders = [];
    // existingUser.wishlist = [];

    // await existingUser.save();
    return existingUser;
  }

  async Tweet(userId) {
    const profile = await UserModel.findById(userId).populate("tweet");

    return profile.tweet;
  }

  async AddTweetToProfile(userId, tweet) {
    const profile = await UserModel.findById(userId);

    if (profile) {
      if (profile.tweet == undefined) {
        profile.tweet = [];
        profile.tweet.push(tweet._id);
      } else {
        let tweets = profile.tweet;
        let isExist = false;
        tweets.map((item) => {
          if (item._id.toString() === tweet._id.toString()) {
            tweets.splice(tweets.indexOf(item), 1);
            isExist = true;
          }
        });
        if (!isExist) {
          profile.tweet.push(retweet._id);
        }
      }

      const profileResult = await profile.save();

      return profileResult;
    }

    throw new Error("Unable to add to tweet!");
  }

  async AddRetweetToProfile(userId, retweet) {
    const profile = await UserModel.findById(userId);

    if (profile) {
      if (profile.retweet == undefined) {
        profile.retweet = [];
        profile.retweet.push(retweet._id);
      } else {
        let retweets = profile.retweet;
        let isExist = false;
        retweets.map((item) => {
          if (item._id.toString() === retweet._id.toString()) {
            retweets.splice(retweets.indexOf(item), 1);
            isExist = true;
          }
        });
        if (!isExist) {
          profile.retweet.push(retweet._id);
        }
      }

      const profileResult = await profile.save();

      return profileResult;
    }

    throw new Error("Unable to add to retweet!");
  }

  // async AddOrderToProfile(userId, tweet) {
  //   const profile = await UserModel.findById(userId);

  //   if (profile) {
  //     if (profile.tweet == undefined) {
  //       profile.tweet = [];
  //     }
  //     profile.tweet.push(tweet._id);

  //     // profile.cart = [];

  //     const profileResult = await profile.save();

  //     return profileResult;
  //   }

  //   throw new Error("Unable to add to order!");
  // }
}

module.exports = UserRepository;
