const express = require("express");
const faultyRoutes = express.Router();
const UserModel=require("../db/userModel").UserModel
const CourseModel=require("../db/courseModel")

// find course list for faulty
faultyRoutes.route("/faultyCourseList").post(function (req, res){
    UserModel.findOne({email:req.body.email})
    .populate("courses")
    .exec(function (err, course) {
        if (err) return console.log(err);
        if(course){
            res.json(course.courses)
        }else{
            res.json([])
        }
    })
})

// faulty create a course
faultyRoutes.route("/createCourse").post(function (req, res){

    UserModel.findOne({email:req.body.email}, function(err, data){
        if(err) res.send(err)
        var user=data
        var newCourse = new CourseModel({
            title: req.body.title,
            description: req.body.description,
            weekday: req.body.weekday,
            faulty:user.username,
            startTime:req.body.startTime,
            endTime:req.body.endTime
        })
        //create a course to courseModel
        CourseModel.create(newCourse, function(err, data){
            if (err) return res.send(err);
            var course = data;
            // add course to faulty model
            UserModel.findByIdAndUpdate(
                user._id,
                { $push: { courses: course._id } },
                { new: true, useFindAndModify: false },function(err){
                    if (err) return res.send(err);
                    return res.json({ success: true, message: 'Course created successfully.' });
                })
        })
    })

    
    
    
   });

// get the course information faulty need to edit
faultyRoutes.route("/course/:id").get((req, res)=>{
    // let myquery = { _id: ObjectId(req.params.id) };
    CourseModel.findOne({_id:req.params.id}, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
})

// update the course information faulty editted
faultyRoutes.route("/update/:id").post(function (req, response) {
    // let myquery = { _id: ObjectId(req.params.id) };
    let newvalues = {
      $set: {
        title: req.body.title,
        description: req.body.description,
        weekday: req.body.weekday,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      },
    };
    // console.log(myquery)
    // console.log(newvalues)
    CourseModel.updateOne({_id:req.params.id}, newvalues, function (err, res) {
        if (err) throw err;
        console.log("1 course updated");
        response.json(res);
      });
});

// delete course by faulty
faultyRoutes.route("/delete/:id").post((req, res) => {
    // Since we only have id of the department being deleted, we need to find it first
    CourseModel.findOne({ _id: req.params.id}, function(err, data) {
        if (err) return res.send(err);
        var course = data;

        // Now we know the company it belongs to and should dis-associate them
        // by removing the company's reference to this department
        UserModel.findOne({ email: req.body.email }, function(err, data) {
            if (err) return res.send(err);
            var user = data;

            // Again we loop through the company's departments array to remove the ref
            for (var i = 0; i < user.courses.length; i++) {
                if (user.courses[i].equals(course._id)) {
                    user.courses.splice(i, 1);
                    break;
                }
            }
            user.save(function(err) {
                if (err) return res.send(err);
            });

            // I guess it should be synchronously AFTER everything is done,
            // since if it is done in parallel with Department.findOne(..)
            // piece, the remove part can happen BEFORE the dep is found
            CourseModel.deleteOne({ _id: req.params.id }, function(err, data) {
                if (err) return res.send(err);
                return res.json({ success: true, message: 'Course deleted successfully.' });
            });
        });
    });

});

// get the student list
faultyRoutes.route("/studentList/:id").get((req, res) => {
    CourseModel.findOne({_id:req.params.id})
    .populate("students")
    .exec(function (err, data) {
        if (err) return console.log(err);
        var course=data
        res.send(course.students)
    })
})



module.exports = faultyRoutes;