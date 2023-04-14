const { TweetRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class TweetService {
  constructor() {
    this.repository = new TweetRepository();
  }

  async LikeTweet(_id, id) {
    const tweetItems = await this.repository.LikeTweet(_id, id);
    return FormateData(tweetItems);
  }

  async CommentTweet(_id, id, msg) {
    const tweetItems = await this.repository.CommentTweet(_id, id, msg);
    return FormateData(tweetItems);
  }

  async GetTweet({ _id }) {
    const tweetItems = await this.repository.Tweet(_id);
    return FormateData(tweetItems);
  }

  async SpecificTweet(_id) {
    const tweet = await this.repository.SpecificTweet(_id);
    return FormateData(tweet);
  }

  async GetAllTweet() {
    const tweetItems = await this.repository.AllTweet();
    return FormateData(tweetItems);
  }

  async Tweet(userInput) {
    const { _id, msg, photo, video } = userInput;

    const tweetResult = await this.repository.CreateNewTweet(
      _id,
      msg,
      photo,
      video
    );

    return FormateData(tweetResult);
  }

  async Delete(_id, id) {
    const deleteResult = await this.repository.Delete(_id, id);

    return FormateData(deleteResult);
  }

  // async SubscribeEvents(payload) {
  //   payload = JSON.parse(payload);
  //   const { event, data } = payload;
  //   const { userId, retweet, qty } = data;

  //   switch (event) {
  //     case "ADD_TO_CART":
  //       this.ManageCart(userId, retweet, qty, false);
  //       break;
  //     case "REMOVE_FROM_CART":
  //       this.ManageCart(userId, retweet, qty, true);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  async GetOrderPayload(userId, tweet, event) {
    if (tweet) {
      const payload = {
        event: event,
        data: { userId, tweet },
      };

      return payload;
    } else {
      return FormateData({ error: "No Tweet Available" });
    }
  }
}

module.exports = TweetService;
