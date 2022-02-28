const express = require("express");
const {
  createComment,
  getCommentByCommentId,
  deleteCommentByCommentId,
  updateCommentByCommentId,
  getCommentsByPostId,updatePostCaption
} = require("../controller/commentController");
const commentRouter = express.Router();

commentRouter.route("/").post(createComment);
commentRouter.route("/post/:pid").get(getCommentsByPostId);
commentRouter
  .route("/:comment_id")
  .get(getCommentByCommentId)
  .delete(deleteCommentByCommentId)
  .patch(updateCommentByCommentId);
module.exports = commentRouter;
