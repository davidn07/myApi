const mongoose = require("mongoose");

//Defining schema
const requestSchema = new mongoose.Schema({
  prayer_request: {
    type: String,
    required: true,
    expires: 604800,
  },
  created_at: {
    type: Date,
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
  gender: {
    type: String,
  },
});

//Create model (collectionName, schema)
const Request = mongoose.model("REQUEST", requestSchema);

//exporting the model
module.exports = Request;
