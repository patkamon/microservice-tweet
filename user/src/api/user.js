const UserService = require("../services/user-service");
const UserAuth = require("./middlewares/auth");
const { SubscribeMessage } = require("../utils");

module.exports = (app, channel) => {
  const service = new UserService();

  // To listen
  SubscribeMessage(channel, service);

  app.post("/signup", async (req, res, next) => {
    const { email, username, password, phone } = req.body;
    const { data } = await service.SignUp({ email, username, password, phone });
    res.json(data);
  });

  app.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    const { data } = await service.SignIn({ email, password });

    res.json(data);
  });

  app.post("/profile", UserAuth, async (req, res, next) => {
    const { _id } = req.user;

    const { name, desc, img, cover } = req.body;

    const { data } = await service.AddNewAddress(_id, {
      name,
      desc,
      img,
      cover,
    });

    res.json(data);
  });

  app.get("/profile", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetProfile({ _id });
    res.json(data);
  });

  app.get("/all", async (req, res, next) => {
    const { data } = await service.GetAllUser();
    res.json(data);
  });

  app.get("/profile/:username", async (req, res, next) => {
    const { data } = await service.GetProfileByUsername({
      username: req.params.username,
    });
    res.json(data);
  });

  app.get("/profile/id/:id", async (req, res, next) => {
    const { data } = await service.GetProfile({ _id: req.params.id });
    res.json(data);
  });

  app.get("/tweet", UserAuth, async (req, res, next) => {
    const { _id } = req.user;
    const { data } = await service.GetTweet(_id);
    return res.status(200).json(data);
  });

  app.get("/whoami", (req, res, next) => {
    return res.status(200).json({ msg: "/user : I am user Service" });
  });
};
