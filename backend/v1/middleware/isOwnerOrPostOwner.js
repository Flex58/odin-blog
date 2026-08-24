const db = require("../lib/queries");

exports.isOwnerOrPostOwner = async (req, res, next) => {
  //req.user == comment.author || req.user == comment.post.author
  const comment = await db.getCommentById(parseInt(req.params.commentId));

  if (req.user.id == comment.authorId || req.user.id == comment.posts.authorId)
    next();
  else
    res.status(403).json({ message: "You do not own the comment or the post" });
};
