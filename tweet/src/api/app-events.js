const TweetService = require("../services/tweet-service");

module.exports = (app) => {
  const service = new TweetService();

  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;
    console.log("============= Taveet ================");

    console.log(payload);

    //handle subscribe events
    service.SubscribeEvents(payload);

    return res.status(200).json({ message: "notified!" });
  });
};
