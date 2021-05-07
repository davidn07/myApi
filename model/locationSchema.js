const mongoose = require("mongoose");

//Defining schema
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
});

//Create model (collectionName, schema)
const Location = mongoose.model("LOCATION", locationSchema);

//exporting the model
module.exports = Location;
