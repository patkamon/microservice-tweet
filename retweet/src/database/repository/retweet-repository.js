const mongoose = require("mongoose");
const { RetweetModel } = require("../models");
const { v4: uuidv4 } = require("uuid");

//Dealing with data base operations
class RetweetRepository {
  async Retweet(userId) {
    const retweetItems = await RetweetModel.find({ userId: userId });
    if (retweetItems) {
      return retweetItems;
    }

    throw new Error("Data Not found!");
  }

  async SpecificRetweet(id) {
    const retweetItems = await RetweetModel.find(id);
    if (retweetItems) {
      return retweetItems;
    }

    throw new Error("Data Not found!");
  }

  async LikeRetweet(userId, retweetId) {
    const retweets = await RetweetModel.find({ _id: retweetId });
    const existingRetweet = retweets[0];
    if (existingRetweet) {
      let retweetLike = existingRetweet.like;
      let found = false;
      console.error(retweetLike);
      if (retweetLike.length > 0) {
        retweetLike.map((item) => {
          if (item.toString() === userId.toString()) {
            retweetLike.splice(retweetLike.indexOf(item), 1);
            found = true;
          }
        });
      }
      if (found !== true) {
        retweetLike.push(userId);
      }

      existingRetweet.like = retweetLike;
      existingRetweet.like_count = retweetLike.length;

      return await existingRetweet.save();
    } else {
      return [];
    }
  }

  async CommentRetweet(userId, retweetId, msg) {
    const retweets = await RetweetModel.find({ _id: retweetId });
    const existingRetweet = retweets[0];
    const comment = { userId: userId, msg: msg, createdAt: Date.now() };
    existingRetweet.comment.push(comment);

    return await existingRetweet.save();
  }

  async AllRetweet() {
    const retweetItems = await RetweetModel.find()
      .sort({ $natural: -1 })
      .limit(100);
    if (retweetItems) {
      return retweetItems;
    }

    throw new Error("Data Not found!");
  }

  async Delete(userId, _id) {
    const retweets = await RetweetModel.deleteOne({ userId: userId, _id: _id });
    return `DELETE ${_id}`;
  }

  async CreateNewRetweet(userId, id, msg) {
    const _id = uuidv4();
    const retweet = new RetweetModel({
      userId,
      _id,
      id,
      msg,
    });
    await retweet.save();
    return retweet;
  }
}

module.exports = RetweetRepository;
