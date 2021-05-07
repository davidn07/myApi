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
  },
  password: {
    type: String,
  },
  profile_img: {
    type: String,
  },
  gender: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
});

//Create model (collectionName, scema)
const User = mongoose.model("USER", userSchema);

//exporting the model
module.exports = User;
