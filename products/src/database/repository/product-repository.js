const mongoose = require("mongoose");
const { RetweetModel, OrderModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class ProductRepository {
  async Retweet(userId) {
    const cartItems = await OrderModel.find({ userId: userId });
    if (cartItems) {
      return cartItems;
    }

    throw new Error("Data Not found!");
  }

  async Delete(userId, _id) {
    // return await CartModel.deleteMany();

    const cart = await OrderModel.findOne({ userId: userId });

    if (cart) {
      let isExist = false;

      let cartItems = cart.retweet;

      if (cartItems.length > 0) {
        cartItems.map((item) => {
          if (item._id.toString() === _id.toString()) {
            cartItems.splice(cartItems.indexOf(item), 1);
            isExist = true;
          }
        });
      }

      cart.retweet = cartItems;

      return await cart.save();
    } else {
      return [];
    }
  }

  async CreateNewOrder(userId, id, msg) {
    //required to verify payment through TxnId

    const cart = await OrderModel.findOne({ userId: userId });
    const _id = uuidv4();
    const tweet = new RetweetModel({
      userId,
      _id,
      id,
      msg,
    });

    if (cart) {
      //   let amount = 0;

      let cartItems = cart.retweet;

      //   if (cartItems.length > 0) {
      //process Order

      // cartItems.map((item) => {
      //   amount += parseInt(item.product.price) * parseInt(item.unit);
      // });

      // const order = new OrderModel({
      //   orderId,
      //   userId,
      //   amount,
      //   status: "received",
      //   items: cartItems,
      // });

      // cart.items = [];

      cartItems.push(tweet);
      cart.retweet = cartItems;

      const orderResult = await tweet.save();
      await cart.save();
      return orderResult;
      //   }
    }
    const order = new OrderModel({
      userId,
      retweet: [tweet],
    });
    await order.save();
    return order;
  }
}

module.exports = ProductRepository;
