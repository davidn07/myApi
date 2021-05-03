const express = require("express");
const cors = require("cors");
const compression = require("compression");
const app = express();

app.use(cors());

//Db connection
require("./db/conn");
app.use(express.json());
app.use(compression());

const PORT = process.env.PORT || 5000;

app.use(require("./routes/auth"));

app.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
