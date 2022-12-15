var mongoose=require("mongoose")
var Schema=mongoose.Schema
var newsSchema=new Schema({
    author:{
        type: String,
    },
    title:{
        type: String,
    },
    source:{
        type: String,
    },
    publishedAt:{
        type: String,
    },
    description:{
        type: String,
    },
    url:{
        type: String,
    },
    comments: [
        {
          type: Schema.Types.ObjectId,
          ref: "comment"
        }
    ]
})
NewsModel = mongoose.model('news', newsSchema);
module.exports = NewsModel