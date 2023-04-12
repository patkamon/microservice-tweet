const mongoose = require("mongoose");
const { RetweetModel, OrderModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class RetweetRepository {
  async Retweet(userId) {
    const retweetItems = await OrderModel.find({ userId: userId });
    if (retweetItems) {
      return retweetItems;
    }

    throw new Error("Data Not found!");
  }

  async Delete(userId, _id) {
    const retweet = await OrderModel.findOne({ userId: userId });

    if (retweet) {
      let retweetItems = retweet.retweet;

      if (retweetItems.length > 0) {
        retweetItems.map((item) => {
          if (item._id.toString() === _id.toString()) {
            retweetItems.splice(retweetItems.indexOf(item), 1);
          }
        });
      }

      retweet.retweet = retweetItems;

      return await retweet.save();
    } else {
      return [];
    }
  }

  async CreateNewRetweet(userId, id, msg) {
    //required to verify payment through TxnId

    const retweets = await OrderModel.findOne({ userId: userId });
    const _id = uuidv4();
    const retweet = new RetweetModel({
      userId,
      _id,
      id,
      msg,
    });

    if (retweets) {
      let retweetItems = retweets.retweet;

      retweetItems.push(retweet);
      retweets.retweet = retweetItems;

      const retweetResult = await retweet.save();
      await retweets.save();
      return retweetResult;
      //   }
    }
    const newRetweet = new OrderModel({
      userId,
      retweet: [retweet],
    });
    await newRetweet.save();
    return newRetweet.retweet[0];
  }
}

module.exports = RetweetRepository;
