const { RetweetRepository } = require("../database");
const { FormateData } = require("../utils");

// All Business logic will be here
class RetweetService {
  constructor() {
    this.repository = new RetweetRepository();
  }

  async GetRetweet({ _id }) {
    const retweetItems = await this.repository.Retweet(_id);
    return FormateData(retweetItems);
  }

  async Retweet(userInput) {
    const { _id, id, msg } = userInput;

    const retweetResult = await this.repository.CreateNewRetweet(_id, id, msg);

    return FormateData(retweetResult);
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

  async Delete(_id, id) {
    const deleteResult = await this.repository.Delete(_id, id);

    return FormateData(deleteResult);
  }

  async GetOrderPayload(userId, retweet, event) {
    if (retweet) {
      const payload = {
        event: event,
        data: { userId, retweet },
      };

      return payload;
    } else {
      return FormateData({ error: "No Retweet Available" });
    }
  }
}

module.exports = RetweetService;
