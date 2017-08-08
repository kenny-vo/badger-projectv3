var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VendorSchema = new Schema({
  name: String,
  description: String

})

var Vendor = mongoose.model('Vendor', VendorSchema);

module.exports = Vendor;
