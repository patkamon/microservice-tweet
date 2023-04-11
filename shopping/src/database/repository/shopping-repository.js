const mongoose = require("mongoose");
const { TweetModel, OrderModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class ShoppingRepository {
  async Tweet(userId) {
    const cartItems = await OrderModel.find({ userId: userId });
    if (cartItems) {
      return cartItems;
    }

    throw new Error("Data Not found!");
  }

  async Delete(userId, _id) {
    const cart = await OrderModel.findOne({ userId: userId });

    if (cart) {
      let isExist = false;

      let cartItems = cart.tweet;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          if (item._id.toString() === _id.toString()) {
            cartItems.splice(cartItems.indexOf(item), 1);
            isExist = true;
          }
        });
      }

      cart.tweet = cartItems;

      return await cart.save();
    } else {
      return [];
    }
  }

  async CreateNewOrder(userId, msg) {
    //required to verify payment through TxnId

    const cart = await OrderModel.findOne({ userId: userId });
    const _id = uuidv4();
    const tweet = new TweetModel({
      userId,
      _id,
      msg,
    });

    if (cart) {
      let cartItems = cart.tweet;

      cartItems.push(tweet);
      cart.tweet = cartItems;

      const orderResult = await tweet.save();
      await cart.save();
      return orderResult;
      //   }
    }
    const order = new OrderModel({
      userId,
      tweet: [tweet],
    });
    await order.save();
    return order;
  }
}

module.exports = ShoppingRepository;
