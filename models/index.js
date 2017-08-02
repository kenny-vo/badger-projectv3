var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/3000");

var Listing = require('./listing');

module.exports.Listing = Listing;
