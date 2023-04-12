const { RetweetRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class RetweetService {
  constructor() {
    this.repository = new RetweetRepository();
  }

  async GetRetweet({ _id }) {
    const cartItems = await this.repository.Retweet(_id);
    return FormateData(cartItems);
  }

  async Retweet(userInput) {
    const { _id, id, msg } = userInput;

    const orderResult = await this.repository.CreateNewOrder(_id, id, msg);

    return FormateData(orderResult);
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

  async Delete(_id, id) {
    const deleteResult = await this.repository.Delete(_id, id);

    return FormateData(deleteResult);
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

module.exports = RetweetService;
