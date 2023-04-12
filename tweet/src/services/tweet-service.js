const { TweetRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class TweetService {
  constructor() {
    this.repository = new TweetRepository();
  }

  async GetTweet({ _id }) {
    const cartItems = await this.repository.Tweet(_id);
    return FormateData(cartItems);
  }

  async Tweet(userInput) {
    const { _id, msg } = userInput;

    const orderResult = await this.repository.CreateNewOrder(_id, msg);

    return FormateData(orderResult);
  }

  async Delete(_id, id) {
    const deleteResult = await this.repository.Delete(_id, id);

    return FormateData(deleteResult);
  }

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, retweet, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, retweet, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, retweet, qty, true);
        break;
      default:
        break;
    }
  }

  async GetOrderPayload(userId, order, event) {
    if (order) {
      const payload = {
        event: event,
        data: { userId, order },
      };

      return payload;
    } else {
      return FormateData({ error: "No Order Available" });
    }
  }
}

module.exports = TweetService;
