const { USER_SERVICE, TWEET_SERVICE } = require("../config");
const ProductService = require("../services/product-service");
const { PublishMessage } = require("../utils");
const UserAuth = require("./middlewares/auth");

module.exports = (app, channel) => {
  const service = new ProductService();

  // SubscribeMessage(channel, service);

  app.post("/retweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { id, msg } = req.body;

    const { data } = await service.Retweet({ _id, id, msg });

    const payload = await service.GetOrderPayload(_id, data, "CREATE_CART");

    // PublishUserEvent(payload)
    PublishMessage(channel, USER_SERVICE, JSON.stringify(payload));

    res.status(200).json(data);
  });

  app.get("/retweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { data } = await service.GetRetweet({ _id });

    res.status(200).json(data);
  });

  app.delete("/retweet/:id", UserAuth, async (req, res, next) => {
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
    return res.status(200).json({ msg: "/shoping : I am Retweet Service" });
  });
};
