var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ListingSchema = new Schema({
  topic: String,
  description: String,
  budget: String,
  location: String,
  req1: String,
  req2: String,
  req3: String,
  date_post: String,
  date_req: String
})

var Listing = mongoose.model('Listing', ListingSchema);

module.exports = Listing;
