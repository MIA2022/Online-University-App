const express = require("express");
const studentRoutes = express.Router();
const CourseModel=require("../db/courseModel")
const UserModel=require("../db/userModel").UserModel
const ObjectId = require("mongoose").Types.ObjectId;
const StudentModel=require("../db/userModel").StudentModel
const FaultyModel=require("../db/userModel").FaultyModel

// load all course list for student to register
studentRoutes.route("/studentCourseList").get((req, res)=>{
    CourseModel.find({}, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})

// load all course student has already registered
studentRoutes.route("/registeredCourseList").post(function (req, res){
    var email=req.body.email
    UserModel.findOne({email:email})
        .populate("courses")
        .exec(function (err, user) {
            var user=user
            if (err) return console.log(err);
            if(user.courses){
                res.json(user.courses)
            }else{
                res.json([])
            }
    })
})

// // find all registered CourseList ID to change the status of register button
studentRoutes.route("/registeredCourseListID").post(function (req, res){
    var email=req.body.email
    UserModel.findOne({email:req.body.email},function (err, user) {
        var user=user
        if (err) return console.log(err);
        if(user.courses){
            res.json(user.courses)
        }else{
            res.json([])
        }
   } )
})

// load new courselist after clicking search button
studentRoutes.route("/searchCourse").post((req, res)=>{
    var title=req.body.title
    var faulty=req.body.faulty
    if(title&&faulty){
        CourseModel.find({title:title,faulty:faulty}, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }else if(title){
        CourseModel.find({title:title}, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }else if(faulty){
        CourseModel.find({faulty:faulty}, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }else{
        CourseModel.find({}, function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }
    
})

//register course
studentRoutes.route("/register/:id").post((req, res)=>{
    var email=req.body.email
    UserModel.findOne({email:email}, function(err, data){
        if (err) return res.send(err);
        var user = data;
        console.log(user)
        UserModel.findByIdAndUpdate(user._id,
            { $push: { courses: req.params.id } },
            { new: true, useFindAndModify: false })
            .populate("courses")
            .exec(function (err, user) {
                if (err) return console.log(err);
                if(user.courses){
                    res.json(user.courses)
                }else{
                    res.json([])
                }
            })

        CourseModel.findByIdAndUpdate(
            req.params.id,
            { $push: { students: user._id } },
            { new: true, useFindAndModify: false }, function(err, data){
                if (err) return res.send(err);
                var course=data;
                console.log(course.students.length)
        });
    })
})

// drop course
studentRoutes.route("/drop/:id").post((req, res)=>{
    // let myquery = { _id: ObjectId(req.params.id) };
    let email=req.body.email
    UserModel.findOne({email:email},function (err, result){
        if (err) throw err;
        var user=result
        //delete students in course
        CourseModel.findOne({_id: req.params.id},function (err, result){
            if (err) throw err;
            var course=result
            for (var i = 0; i < course.students.length; i++) {
                if (course.students[i].equals(user._id)) {
                    course.students.splice(i, 1);
                    break;
                }
            }
            course.save(function(err) {
                if (err) return res.send(err);
                
            });
        })
        // delete course in student model
        for (var i = 0; i < user.courses.length; i++) {
            if (user.courses[i].equals(req.params.id)) {
                user.courses.splice(i, 1);
                break;
            }
        }
        user.save(function(err, user) {
            if (err) return res.send(err);
            console.log(user)
            res.send(user.courses)
        });
    })
})

module.exports = studentRoutes;