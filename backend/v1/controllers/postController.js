const { body, validationResult, matchedData } = require("express-validator");
const db = require("../lib/queries");
const { createContext } = require("react");

const postValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title can't be empty")
    .isLength({ max: 60 })
    .withMessage("Title can't exceed 60 characters"),
  body("content").notEmpty().withMessage("Blog can't be empty"),
  body("published")
    .isBoolean()
    .withMessage("Published must be a true/false value"),
];

exports.getPosts = async (req, res) => {
  const data = await db.getPosts();
  return res.status(200).json({ data });
};

exports.postPosts = [
  postValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
      });
    }
    const data = matchedData(req);
    const post = await db.createPost(data, req.user.id);
    return res.status(201).json({ post });
  },
];

exports.updatePost = [
  postValidation,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        title: req.body.title,
        content: req.body.content,
        published: req.body.published,
      });
    }
    const data = matchedData(req);
    const postId = parseInt(req.params.postId);
    const post = await db.updatePost(postId, data, req.user.id);
    return res.status(200).json({ post });
  },
];

exports.deletePost = async (req, res) => {
  const postId = parseInt(req.params.postId);
  await db.deletePost(postId);
  return res.status(200).json({ message: "Post deleted" });
};

exports.getSpecificPost = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = await db.getSpecificPost(postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  return res.status(200).json({ post });
};
