const express = require("express");
const newsRoutes = express.Router();
const fetch = require("node-fetch");
const NewsModel=require("../db/newsModel")
const UserModel=require("../db/userModel").UserModel
const CommentModel=require("../db/commentModel")


global.errMsg=""

function fetchTheData(url){
    fetch(url)
    .then(response=>checkStatus(response))
    .then(response=>{return response.json()})
    .then(json=>processResponse(json))
    .catch(error=>handleError(error));
}

function checkStatus(response) {
    if (response.status===200||response.status===400||
        response.status===401||response.status===429||response.status===500) {
        return response;
    }else{
        throw Error("Error in get request. ");
    }
}

function processResponse(response){        
    if(response.status==='ok' && response.articles.length!==0){
        response.articles.forEach(item=>{
        NewsModel.exists({ "title": item.title }, function (err, doc) {
            if (err){
                console.log(err)
            }else{
                if(!doc){
                    let news=new NewsModel({
                        title:item.title,
                        author:item.author,
                        source:item.source.name,
                        description:item.description,
                        url:item.url,
                        publishedAt:item.publishedAt,
                    })
                    news.save()
                        .then(news=>{
                            console.log("News Added Successfully!");
                        })
                        .catch(error=>{
                            console.log(error)
                            console.log("News don't added Successfully!");
                            errMsg="An error occured when save news!"
                        }) 
                }
            }
        })
            
        })
    }else{
        if(response.status==='ok'){
            errMsg = 'No article exits according to your requirements.'
        }else{
            errMsg = 'Error code: ' + response.code + '\n' +
                    'Error message: ' + response.message
        }
    }
    return errMsg
}

function handleError(err){
    errMsg +=err.message
}

// search news from remote API and store in local database
newsRoutes.route("/results").post(function (req, res) {
    var topHeadlinesUrl='https://newsapi.org/v2/top-headlines'
    let url= topHeadlinesUrl+ '?' + req.body.params
    fetchTheData(url)
    console.log(errMsg)
    res.json({
        message:errMsg
    })
});

// find the newsDetail and its comments
newsRoutes.route("/detail").post(function (req, res) {

    NewsModel.find({ title: req.body.title }).populate("comments", "-_id -__v").exec(function(err, docs){
        if (err){
            return(
                res.json({
                    message:"An error occured when find news detail!"
                })
            )
        }
        else{
            console.log(docs)
            return (
                res.json({
                title: docs[0].title,
                author: docs[0].author,
                source:docs[0].source,
                description:docs[0].description,
                url:docs[0].url,
                _id:docs[0]._id,
                comments:docs[0].comments
            }))
        }});
});

// add a comment
newsRoutes.route("/addcomment").post(function (req, res) {
    var newsID=req.body.id
    UserModel.findOne({email:req.body.email}, function(err, data){
        if (err) return res.send(err);
        var user = data;
        let newComment = new CommentModel({
            username:user.username,
            userID: user._id,
            comment: req.body.comment,
            newsTitle:req.body.title
        });

        CommentModel.create(newComment, function(err, data){
            if (err) return res.send(err);
            var comment = data;

            UserModel.findByIdAndUpdate(
                user._id,
                { $push: { comments: comment._id } },
                { new: true, useFindAndModify: false },function(err){
                    if (err) return res.send(err);
            })
            
            NewsModel.findByIdAndUpdate(
                newsID,
                { $push: { comments: comment._id } },
                { new: true, useFindAndModify: false },function(err, data){
                    if (err) return res.send(err);

                    NewsModel.findById(newsID)
                        .populate("comments")
                        .exec(function (err, news) {
                            if (err) return console.log(err);
                            var news=news
                            res.json({
                                title: news.title,
                                author: news.author,
                                source:news.source,
                                description:news.description,
                                url:news.url,
                                _id:news._id,
                                comments:news.comments
                            })
                        })
                });
        })
        
    })
});

// search comments
newsRoutes.route("/searchComment").get(function (req, res){
    CommentModel.find({})
        .sort({ 'created_at' : -1 })
        .distinct('newsTitle')
        .exec(function(err, data){
            if(err) res.send(err)
            var comments=data
            res.send(comments)
        })
})

module.exports = newsRoutes;