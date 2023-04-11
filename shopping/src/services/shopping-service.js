const { ShoppingRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ShoppingService {
  constructor() {
    this.repository = new ShoppingRepository();
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

  async SubscribeEvents(payload) {
    payload = JSON.parse(payload);
    const { event, data } = payload;
    const { userId, product, qty } = data;

    switch (event) {
      case "ADD_TO_CART":
        this.ManageCart(userId, product, qty, false);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
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

module.exports = ShoppingService;
