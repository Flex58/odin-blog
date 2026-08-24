const { Router } = require("express");
const commentController = require("../controllers/commentController");
const { isAuth } = require("../middleware/isAuth");

const commentRouter = Router();

commentRouter.get("/", commentController.getComments);
commentRouter.post("/", isAuth, commentController.postComment);
commentRouter.delete(
  "/:commentId",
  isAuth,
  isOwnerOrPostOwner,
  commentController.deleteComment,
);
