const { Router } = require("express");
const postController = require("../controllers/postController");
const { isAuthor } = require("../middleware/isAuthor");
const { isAuth } = require("../middleware/isAuth");
const { isOwner } = require("../middleware/isOwner");

const postRouter = Router();

postRouter.get("/", postController.getPosts); //query author to get only authors posts?
postRouter.post("/", isAuth, isAuthor, postController.postPosts);
postRouter.put(
  "/:postId",
  isAuth,
  isAuthor,
  isOwner,
  postController.updatePost,
);
postRouter.delete(
  "/:postId",
  isAuth,
  isAuthor,
  isOwner,
  postController.deletePost,
);
postRouter.get("/:postId", postController.getSpecificPost);

module.exports = { postRouter };
