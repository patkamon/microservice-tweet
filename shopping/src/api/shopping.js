const ShoppingService = require("../services/shopping-service");
const { SubscribeMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");
const { USER_SERVICE } = require("../config");
const { PublishMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new ShoppingService();

  SubscribeMessage(channel, service);

  app.post("/tweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { msg } = req.body;

    const { data } = await service.Tweet({ _id, msg });

    const payload = await service.GetOrderPayload(_id, data, "CREATE_ORDER");

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

    const { data } = await service.Delete(_id, req.body._id);

    res.status(200).json(data);
  });

  //   app.put("/cart", UserAuth, async (req, res, next) => {
  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);
  //   });

  //   app.delete("/cart/:id", UserAuth, async (req, res, next) => {
  //     const { _id } = req.user;

  //     const { data } = await service.AddToCart(_id, req.body._id);

  //     res.status(200).json(data);
  //   });

  //   app.get("/cart", UserAuth, async (req, res, next) => {
  //     const { _id } = req.user;

  //     const { data } = await service.GetCart({ _id });

  //     return res.status(200).json(data);
  //   });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/shoping : I am Shopping Service" });
  });
};
