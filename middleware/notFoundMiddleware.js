exports.notFoundHandler = (req, res, next) => {
    res.status(404).send("You are looking for something that we do not have!");
  };