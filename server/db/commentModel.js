const mongoose = require("mongoose");

const CommentModel = mongoose.model(
  "comment",
  new mongoose.Schema({
    username:{type:String},
    userID: {type:String},
    comment: {type:String},
    newsTitle: {type:String},
    createdAt: {
        type:Date,
        default:Date.now()
    }
  })
);

module.exports = CommentModel;