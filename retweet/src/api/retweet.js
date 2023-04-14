const { USER_SERVICE, TWEET_SERVICE } = require("../config");
const RetweetService = require("../services/retweet-service");
const { PublishMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new RetweetService();

  // SubscribeMessage(channel, service);

  app.post("", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { id, msg } = req.body;

    const { data } = await service.Retweet({ _id, id, msg });

    const payload = await service.GetOrderPayload(_id, data, "CREATE_RETWEET");

    // PublishUserEvent(payload)
    PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.put("/like/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.LikeRetweet(_id, req.params.id);

    res.status(200).json(data);
  });

  app.put("/comment/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { msg } = req.body;

    const { data } = await service.CommentRetweet(_id, req.params.id, msg);

    res.status(200).json(data);
  });

  app.get("", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetRetweet({ _id });

    res.status(200).json(data);
  });

  app.get("/id/:id", async (req, res, next) => {
    const { data } = await service.SpecificRetweet({ _id: req.params.id });

    res.status(200).json(data);
  });

  app.get("/all", async (req, res, next) => {
    const { data } = await service.GetAllRetweet();

    res.status(200).json(data);
  });

  app.delete("/:id", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.Delete(_id, req.params.id);

    const payload = await service.GetOrderPayload(
      _id,
      { _id: req.params.id },
      "DELETE_RETWEET"
    );
    PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Retweet Service" });
  });
};
