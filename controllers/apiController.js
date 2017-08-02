function index(req, res) {
  res.json({
    message: "Welcome to Identifly!",

    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
}

module.exports.index = index;
