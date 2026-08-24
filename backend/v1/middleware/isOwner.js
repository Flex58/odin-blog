const db = require("../lib/queries");

exports.isOwner = async (req, res, next) => {
  const post = await db.getPostByAuthorAndId(
    parseInt(req.params.postId),
    req.user.id,
  );

  if (post) next();
  else res.status(403).json({ message: "You do not own this post" });
};
