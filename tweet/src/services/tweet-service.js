const { TweetRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class TweetService {
  constructor() {
    this.repository = new TweetRepository();
  }

  async GetTweet({ _id }) {
    const tweetItems = await this.repository.Tweet(_id);
    return FormateData(tweetItems);
  }

  async Tweet(userInput) {
    const { _id, msg } = userInput;

    const tweetResult = await this.repository.CreateNewTweet(_id, msg);

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
