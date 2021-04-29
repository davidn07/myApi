const mongoose = require("mongoose");

//Defining schema
const requestSchema = new mongoose.Schema({
  prayer_request: {
    type: String,
    required: true,
    expires: 604800,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: Number,
  },
  user_id: {
    type: String,
    required: true,
  },
});

//Create model (collectionName, schema)
const Request = mongoose.model("REQUEST", requestSchema);

//exporting the model
module.exports = Request;
