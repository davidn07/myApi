const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware

const middleware = (req, res, next) => {
  console.log("Hello from Middleware");
  next();
};

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/about", middleware, (req, res) => {
  res.send("Hello About page");
});

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
