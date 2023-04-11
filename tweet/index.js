const express = require("express");

const app = express();

app.use(express.json());

app.use("/", (req, res, next) => {
  return res.status(200).json({ msg: "Hello from Tweet" });
});

app.listen(8003, () => {
  console.log("Tweet is Listening to Port 8003");
});
