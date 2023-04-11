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
    const { email, password, phone } = userInputs;

    // create salt
    let salt = await GenerateSalt();

    let userPassword = await GeneratePassword(password, salt);

    const existingUser = await this.repository.CreateUser({
      email,
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
    const { name, desc, img } = userInputs;

    const addressResult = await this.repository.CreateProfile({
      _id,
      name,
      desc,
      img,
    });

    return FormateData(addressResult);
  }

  async GetProfile(id) {
    const existingUser = await this.repository.FindUserById({ id });
    return FormateData(existingUser);
  }

  //   async GetShopingDetails(id) {
  //     const existingUser = await this.repository.FindUserById({ id });

  //     if (existingUser) {
  //       // const orders = await this.shopingRepository.Orders(id);
  //       return FormateData(existingUser);
  //     }
  //     return FormateData({ msg: "Error" });
  //   }

  async GetTweet(userId) {
    const wishListItems = await this.repository.Tweet(userId);
    return FormateData(wishListItems);
  }

  async AddToTweet(userId, product) {
    const wishlistResult = await this.repository.AddTweetItem(userId, product);
    return FormateData(wishlistResult);
  }

  async ManageCart(userId, retweet) {
    const orderResult = await this.repository.AddRetweetToProfile(
      userId,
      retweet
    );
    return FormateData(orderResult);
  }

  async ManageOrder(userId, tweet) {
    const orderResult = await this.repository.AddOrderToProfile(userId, tweet);
    return FormateData(orderResult);
  }

  async SubscribeEvents(payload) {
    console.log("Triggering.... user Events");

    payload = JSON.parse(payload);

    const { event, data } = payload;

    const { userId, product, order, qty } = data;

    switch (event) {
      case "ADD_TO_WISHLIST":
      case "REMOVE_FROM_WISHLIST":
        this.AddToTweet(userId, product);
        break;
      // case "ADD_TO_CART": // add retweet
      //   this.ManageCart(userId, product, qty, false);
      //   break;
      case "CREATE_CART": // add retweet
        this.ManageCart(userId, order);
        break;
      case "REMOVE_FROM_CART":
        this.ManageCart(userId, product, qty, true);
        break;
      case "CREATE_ORDER": // add tweet
        this.ManageOrder(userId, order);
        break;
      default:
        break;
    }
  }
}

module.exports = UserService;
