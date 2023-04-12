const TweetService = require("../services/tweet-service");
const { SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const { USER_SERVICE } = require("../config");
const { PublishMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new TweetService();

  SubscribeMessage(channel, service);

  app.post("/tweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { msg } = req.body;

    const { data } = await service.Tweet({ _id, msg });

    const payload = await service.GetOrderPayload(_id, data, "CREATE_TWEET");

    PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.get("/tweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetTweet({ _id });

    res.status(200).json(data);
  });

  app.delete("/tweet/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.Delete(_id, req.params.id);

    const payload = await service.GetOrderPayload(
      _id,
      { _id: req.params.id },
      "DELETE_TWEET"
    );

    PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Tweet Service" });
  });
};