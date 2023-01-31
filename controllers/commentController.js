const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const jwt = require("jsonwebtoken");
const { secretKey } = require("../const/Const");
const Comment = require("../models/commentModel");
const Card = require("../models/cardModel");
const commentController = {
  updateComment: async (req, res, next) => {
    const { commentId, ...resData } = req.body;
    try {
      const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $set: resData,
        },
        {
          new: true,
        }
      ).populate([
        {
          path: "replies",
          populate: [
            {
              path: "creator",
              select: {
                _id: 1,
                avatar: 1,
                name: 1,
              },
            },
          ],
        },
        {
          path: "creator",
          select: {
            _id: 1,
            name: 1,
            avatar: 1,
          },
        },
      ]);
      return res.status(200).json({
        success: true,
        message: "Update comment successfully.",
        data: comment,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Update comment fail.",
        err: err,
      });
    }
  },
  react: async (req, res, next) => {},
  addReply: async (req, res, next) => {
    const { commentId, ...resData } = req.body;
    const user = req.data;
    try {
      resData.creator = user._id;
      const reply = await Comment.create(resData);
      const comment = await Comment.findByIdAndUpdate(commentId, {
        $push: {
          replies: reply,
        },
      });
      if (comment.replied) {
        reply.replied = comment.replied;
        reply.repliedUser = comment.repliedUser;
      } else {
        reply.replied = comment._id;
        reply.repliedUser = comment.creator;
      }
      await reply.save();
      return res.status(200).json({
        success: true,
        data: await Comment.findById(commentId).populate([
          {
            path: "replies",
            populate: [
              {
                path: "creator",
                select: {
                  _id: 1,
                  avatar: 1,
                  name: 1,
                },
              },
            ],
          },
          {
            path: "creator",
            select: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        ]),
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Reply fail",
        err: err,
      });
    }
  },
  deleteComment: async (req, res, next) => {
    const { commentId } = req.body;
    try {
      const comment = await Comment.findByIdAndDelete(commentId);
      if (comment.replied) {
        const replied = await Comment.findByIdAndUpdate(comment.replied, {
          $pull: {
            replies: comment._id,
          },
        }).populate([
          {
            path: "replies",
            populate: [
              {
                path: "creator",
                select: {
                  _id: 1,
                  avatar: 1,
                  name: 1,
                },
              },
            ],
          },
          {
            path: "creator",
            select: {
              _id: 1,
              name: 1,
              avatar: 1,
            },
          },
        ]);
        return res.status(200).json({
          success: true,
          message: "Delete comment successfully.",
          data: replied,
        });
      } else {
        const card = await Card.findOneAndUpdate(
          {
            comments: commentId,
          },
          {
            $pull: {
              comments: commentId,
            },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          success: true,
          message: "Delete comment successfully.",
          data: card,
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
      });
    }
  },
};
module.exports = commentController;
