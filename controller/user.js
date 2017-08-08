var User = require('../models/user');
var auth = require('../resources/auth');
var UserController = {
  signup: function (req, res) {
    User.findOne({ email: req.body.email }, function (err, existingUser) {
      if (existingUser) {
        return res.status(409).json({ message: 'Email is already taken.' });
      }

      if(err) {
        return res.json({err});
      }
      var user = new User({
        displayName: req.body.displayName,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });
      //mongodb://kenny:kenny@ds127783.mlab.com:27783/kennytest123
      user.save(function (err, result) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }
        return res.status(201).json({ token: auth.createJWT(result) });
      });
    });
  }
}

module.exports = UserController;
