const mongoose = require("mongoose");
const { TweetModel, OrderModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class TweetRepository {
  async Tweet(userId) {
    const tweetItems = await OrderModel.find({ userId: userId });
    if (tweetItems) {
      return tweetItems;
    }

    throw new Error("Data Not found!");
  }

  async AllTweet() {
    // get latest 100
    const tweetItems = await TweetModel.find()
      .sort({ $natural: -1 })
      .limit(100);
    if (tweetItems) {
      return tweetItems;
    }

    throw new Error("Data Not found!");
  }

  async SpecificTweet(id) {
    const existingTweet = await TweetModel.find(id);
    return existingTweet;
  }

  async Delete(userId, _id) {
    const tweets = await OrderModel.findOne({ userId: userId });

    if (tweets) {
      let tweetItems = tweets.tweet;

      if (tweetItems.length > 0) {
        tweetItems.map((item) => {
          console.error(item, _id);
          if (item._id.toString() === _id.toString()) {
            tweetItems.splice(tweetItems.indexOf(item), 1);
          }
        });
      }
      console.log(tweetItems);

      tweets.tweet = tweetItems;

      return await tweets.save();
    } else {
      return [];
    }
  }

  async CreateNewTweet(userId, msg) {
    //required to verify payment through TxnId

    const tweets = await OrderModel.findOne({ userId: userId });
    const _id = uuidv4();
    const tweet = new TweetModel({
      userId,
      _id,
      msg,
    });

    if (tweets) {
      let tweetItems = tweets.tweet;

      tweetItems.push(tweet);
      tweets.tweet = tweetItems;

      const tweetResult = await tweet.save();
      await tweets.save();
      return tweetResult;
    }
    const newTweet = new OrderModel({
      userId,
      tweet: [tweet],
    });
    await newTweet.save();
    return newTweet.tweet[0];
  }
}

module.exports = TweetRepository;
