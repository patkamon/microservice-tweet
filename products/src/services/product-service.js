const { ProductRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class ProductService {
  constructor() {
    this.repository = new ProductRepository();
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

module.exports = ProductService;
