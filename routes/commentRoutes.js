const commentController = require("../controllers/commentController");
const validateController = require("../controllers/validateController");

const commentRouter = require("express").Router();
commentRouter.put(
  "/update",
  validateController.checkToken,
  commentController.updateComment
);
commentRouter.post(
  "/reply",
  validateController.checkToken,
  commentController.addReply
);
commentRouter.delete(
  "/delete",
  validateController.checkToken,
  commentController.deleteComment
);
module.exports = commentRouter;
