/************
 * DATABASE *
 ************/

 var db = require('../models');

 // GET /api/listings
function index (req, res) {
  db.Listing.find({}, function(err, allListings) {
    res.json(allListings);
  });
}

function create(req, res) {
  console.log('body', req.body);

  db.Listing.create(req.body, function(err, listing) {
    if (err) { console.log('error', err); }
    console.log(listing);
    res.json(listing);
  });
}

function show(req, res) {
  db.Listing.findById(req.params.listingId, function(err, foundListing) {
    if(err) { console.log('listingsController.show error', err); }
    console.log('listingsController.show responding with', foundListing);
    res.json(foundListing);
  });
}

function destroy(req, res) {
  db.Listing.findOneAndRemove({_id: req.params.listingId }, function(err, foundListing){
    res.json(foundListing);
  });
}


module.exports = {
  index: index,
  create: create,
  show: show,
  destroy: destroy
};
