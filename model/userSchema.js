const mongoose = require("mongoose");

//Defining schema
const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//Create model (collectionName, scema)
const User = mongoose.model("USER", userSchema);

//exporting the model
module.exports = User;
