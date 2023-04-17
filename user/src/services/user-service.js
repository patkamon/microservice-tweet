const { UserRepository } = require("../database");
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
} = require("../utils");

// All Business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async SignIn(userInputs) {
    const { email, password } = userInputs;

    const existingUser = await this.repository.FindUser({ email });

    if (existingUser) {
      const validPassword = await ValidatePassword(
        password,
        existingUser.password,
        existingUser.salt
      );
      if (validPassword) {
        const token = await GenerateSignature({
          email: existingUser.email,
          _id: existingUser._id,
        });
        return FormateData({ id: existingUser._id, token });
      }
    }

    return FormateData(null);
  }

  async SignUp(userInputs) {
    const { email, username, password, phone } = userInputs;

    // create salt
    let salt = await GenerateSalt();

    let userPassword = await GeneratePassword(password, salt);

    if (password.length < 8 || password.length > 20) {
      return FormateData({
        msg: "Password need to be between 8-20",
        status: 400,
      });
    } else if (password == password.toLowerCase()) {
      return FormateData({
        msg: "Password need to contain atleast 1 capital letter",
        status: 400,
      });
    }

    const existingUser = await this.repository.CreateUser({
      email,
      username,
      password: userPassword,
      phone,
      salt,
    });

    const token = await GenerateSignature({
      email: email,
      _id: existingUser._id,
    });
    return FormateData({ id: existingUser._id, token });
  }

  async AddNewAddress(_id, userInputs) {
    const { name, desc, img, cover } = userInputs;

    const addressResult = await this.repository.CreateProfile({
      _id,
      name,
      desc,
      img,
      cover,
    });

    return FormateData(addressResult);
  }

  async GetProfile(id) {
    const existingUser = await this.repository.FindUserById({ id });
    return FormateData(existingUser);
  }

  async GetProfileByUsername({ username }) {
    const existingUser = await this.repository.FindUserByUsername({ username });
    return FormateData(existingUser);
  }

  async GetAllUser() {
    const existingUser = await this.repository.AllUser();
    return FormateData(existingUser);
  }

  async GetTweet(userId) {
    const wishListItems = await this.repository.Tweet(userId);
    return FormateData(wishListItems);
  }

  async AddToTweet(userId, retweet) {
    const wishlistResult = await this.repository.AddTweetItem(userId, retweet);
    return FormateData(wishlistResult);
  }

  async ManageRetweet(userId, retweet) {
    const retweetResult = await this.repository.AddRetweetToProfile(
      userId,
      retweet
    );
    return FormateData(retweetResult);
  }

  async ManageTweet(userId, tweet) {
    const tweetResult = await this.repository.AddTweetToProfile(userId, tweet);
    return FormateData(tweetResult);
  }

  async SubscribeEvents(payload) {
    console.log("Triggering.... user Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, retweet, tweet } = data;
    console.error(data);

    switch (event) {
      case "CREATE_RETWEET": // add retweet
        this.ManageRetweet(userId, retweet);
        break;
      case "DELETE_RETWEET": // delete retweet
        this.ManageRetweet(userId, retweet);
        break;
      case "CREATE_TWEET": // add tweet
        this.ManageTweet(userId, tweet);
        break;
      case "DELETE_TWEET": // delete tweet
        this.ManageTweet(userId, tweet);
        break;
      default:
        break;
    }
  }
}

module.exports = UserService;
