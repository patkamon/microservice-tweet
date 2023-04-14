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

  async LikeRetweet(_id, id) {
    const tweetItems = await this.repository.LikeRetweet(_id, id);
    return FormateData(tweetItems);
  }

  async CommentRetweet(_id, id, msg) {
    const tweetItems = await this.repository.CommentRetweet(_id, id, msg);
    return FormateData(tweetItems);
  }

  async SpecificRetweet(_id) {
    const retweetItems = await this.repository.SpecificRetweet(_id);
    return FormateData(retweetItems);
  }

  async GetAllRetweet() {
    const retweetItems = await this.repository.AllRetweet();
    return FormateData(retweetItems);
  }

  async Retweet(userInput) {
    const { _id, id, msg } = userInput;

    const retweetResult = await this.repository.CreateNewRetweet(_id, id, msg);

    return FormateData(retweetResult);
  }

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
