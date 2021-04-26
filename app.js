const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());

//Db connection
require("./db/conn");
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use(require("./routes/auth"));

//Middleware
const middleware = (req, res, next) => {
  next();
};

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
