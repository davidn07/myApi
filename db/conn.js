const mongoose = require("mongoose");

//DB
const DB = `mongodb+srv://david:Davidn@77@cluster0.tuoy6.mongodb.net/firstdb?retryWrites=true&w=majority`;

//connecting to DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((err) => console.log("Error in connecting"));
