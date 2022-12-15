const express = require("express");
const { UserModel } = require("../db/userModel");
const userRoutes = express.Router();
const StudentModel=require("../db/userModel").StudentModel
const FaultyModel=require("../db/userModel").FaultyModel

// register user
userRoutes.route("/register").post(function (req, res) {
    UserModel.find({email:req.body.email}, function(err,data){
        if(err) res.send(err)
        var user=data
        if(user.length){
            res.send([{
                email: "",
                message:"Email has been registered!"
            }])
        }else{
            var newUser
            if(req.body.role=="Faulty"){
                newUser = new FaultyModel({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    college: req.body.college
                });
            }else{
                newUser = new StudentModel({
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    grade: req.body.grade
                });
            }
            newUser.save()
                .then(user=>{
                    console.log("User Added Successfully!");
                    res.json([{
                    email: user.email,
                    message:"User Added Successfully!"
                }])
                })
                .catch(error=>{
                res.json([{
                    email: "",
                    message:"An error occured when register!"
                }])
                })

        }
    })
    
   });

// check user role
userRoutes.route("/checkRole").post(function (req, res){
    UserModel.findOne({email:req.body.email}, function(err, data){
        if(err) res.send(err);
        const user=data;
        res.send({role:user.kind})
    })
})

// check login infomation
userRoutes.route("/checkLoginInfo").post(function (req, res) {
    UserModel.findOne({email:req.body.email}, function(err, user){
        if(err) res.send(err)
        var user=user
        if(user){
            if(req.body.password===user.password){
                res.send([{password:user.password, email:user.email}])
            }else{
                res.send([{password:"", email:user.email}])
            }
        }else{
            res.send([{password:"", email:""}])
        }
    })
});

// get profile information
userRoutes.route("/getProfileInfo").post(function (req, res) {
    UserModel.findOne({email:req.body.email})
        .populate("courses")
        .populate("comments")
        .exec(function (err, user) {
            var user=user
            if (err) return console.log(err);
            res.send(user)
        })
})

//edit profile information
userRoutes.route("/updateProfile/:id").post(function (req, res) {
    let newvalues
    if(req.body.kind=="Faulty"){
        newvalues={
        $set: {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            college: req.body.college
        }};
        FaultyModel.updateOne({_id:req.params.id}, newvalues, {"multi": true}, function (err, data) {
            var faulty=data
            if (err) throw err;
            console.log("1 faulty updated");
            console.log(faulty)
            res.json(faulty);
        });
        
    }else{
        newvalues={
            $set: {
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            grade: req.body.grade
        }};
        StudentModel.updateOne({_id:req.params.id}, newvalues, {"multi": true}, function (err, data) {
            var student=data
            if (err) throw err;
            console.log("1 student updated");
            res.json(student);
        });
    }
})

// get profile information with specific id
userRoutes.route("/profileInfo/:id").get(function (req, res){
    UserModel.findById(req.params.id)
            .populate("comments")
            .exec(function (err, user) {
                var user=user
                if (err) return console.log(err);
                res.send(user)
            })
    
})

module.exports = userRoutes;