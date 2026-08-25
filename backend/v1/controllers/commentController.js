const { body, validationResult, matchedData } = require("express-validator");
const db = require("../lib/queries");

const formValidation = [
  body("content")
    .notEmpty()
    .withMessage("Comment can't be empty")
    .trim()
    .isLength({ max: 10000 })
    .withMessage("Can't exceed 10000 characters"),
  body("postId").notEmpty().withMessage("Post Id required"),
];

exports.getComments = async (req, res) => {
  const data = db.getComments();
  if (!data) {
    return res.status(500);
  }
  return res.status(200).json({ data });
};

exports.postComment = [
  formValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), content: req.body.content });
    }
    const data = matchedData(req);
    const comment = await db.createComment(data, req.user.id);
    return res.status(201).json({ comment });
  },
];

exports.deleteComment = async (req, res) => {
  const commentId = parseInt(req.body.commentId);
  await db.deleteComment(commentId);
  return res.status(200).json({ message: "Comment deleted" });
};
