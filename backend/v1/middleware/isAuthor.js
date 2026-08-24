exports.isAuthor = (req, res, next) => {
  if (req.user.author) {
    next();
  } else {
    res.status(401).json({ message: "Not a Author" });
  }
};
