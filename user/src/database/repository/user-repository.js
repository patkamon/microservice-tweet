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

  async AddTweetItem(userId, { _id, name, desc, img }) {
    const retweet = {
      _id,
      name,
      desc,
      img,
    };

    const profile = await UserModel.findById(userId).populate("tweet");

    if (profile) {
      let wishlist = profile.tweet;

      if (wishlist.length > 0) {
        let isExist = false;
        wishlist.map((item) => {
          if (item._id.toString() === retweet._id.toString()) {
            // no need to delete duplicate
            // const index = wishlist.indexOf(item);
            // wishlist.splice(index, 1);
            isExist = true;
          }
        });

        if (!isExist) {
          wishlist.push(retweet);
        }
      } else {
        wishlist.push(retweet);
      }

      profile.tweet = wishlist;
    }

    const profileResult = await profile.save();

    return profileResult.tweet;
  }

  //   async AddCartItem(userId, { _id, name, price, banner }, qty, isRemove) {
  //     const profile = await UserModel.findById(userId).populate("cart");

  //     if (profile) {
  //       const cartItem = {
  //         retweet: { _id, name, price, banner },
  //         unit: qty,
  //       };

  //       let cartItems = profile.cart;

  //       if (cartItems.length > 0) {
  //         let isExist = false;
  //         cartItems.map((item) => {
  //           if (item.retweet._id.toString() === _id.toString()) {
  //             if (isRemove) {
  //               cartItems.splice(cartItems.indexOf(item), 1);
  //             } else {
  //               item.unit = qty;
  //             }
  //             isExist = true;
  //           }
  //         });

  //         if (!isExist) {
  //           cartItems.push(cartItem);
  //         }
  //       } else {
  //         cartItems.push(cartItem);
  //       }

  //       profile.cart = cartItems;

  //       return await profile.save();
  //     }

  //     throw new Error("Unable to add to cart!");
  //   }

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

    throw new Error("Unable to add to order!");
  }

  async AddOrderToProfile(userId, tweet) {
    const profile = await UserModel.findById(userId);

    if (profile) {
      if (profile.tweet == undefined) {
        profile.tweet = [];
      }
      profile.tweet.push(tweet._id);

      // profile.cart = [];

      const profileResult = await profile.save();

      return profileResult;
    }

    throw new Error("Unable to add to order!");
  }
}

module.exports = UserRepository;
