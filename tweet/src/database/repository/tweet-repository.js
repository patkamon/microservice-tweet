const mongoose = require("mongoose");
const { TweetModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class TweetRepository {
  async Tweet(userId) {
    const tweetItems = await TweetModel.find({ userId: userId });
    if (tweetItems) {
      return tweetItems;
    }

    throw new Error("Data Not found!");
  }

  async LikeTweet(userId, tweetId) {
    const tweets = await TweetModel.find({ _id: tweetId });
    const existingTweet = tweets[0];
    if (existingTweet) {
      let tweetLike = existingTweet.like;
      let found = false;
      console.error(tweetLike);
      if (tweetLike.length > 0) {
        tweetLike.map((item) => {
          if (item.toString() === userId.toString()) {
            tweetLike.splice(tweetLike.indexOf(item), 1);
            found = true;
          }
        });
      }
      if (found !== true) {
        tweetLike.push(userId);
      }

      existingTweet.like = tweetLike;
      existingTweet.like_count = tweetLike.length;

      return await existingTweet.save();
    } else {
      return [];
    }
  }

  async CommentTweet(userId, tweetId, msg) {
    const tweets = await TweetModel.find({ _id: tweetId });
    const existingTweet = tweets[0];
    const comment = { userId: userId, msg: msg, createdAt: Date.now() };
    existingTweet.comment.push(comment);

    return await existingTweet.save();
  }

  async AllTweet() {
    // get latest 100
    const tweetItems = await TweetModel.find();
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
    const tweets = await TweetModel.deleteOne({ userId: userId, _id: _id });
    return `DELETE ${_id}`;
  }

  async CreateNewTweet(userId, msg, photo, video) {
    //required to verify payment through TxnId
    const _id = uuidv4();
    console.error(photo, video);
    const tweet = new TweetModel({
      userId,
      _id,
      msg,
      photo,
      video,
    });

    await tweet.save();
    return tweet;
  }
}

module.exports = TweetRepository;
