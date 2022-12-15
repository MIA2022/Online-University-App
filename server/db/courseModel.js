var mongoose=require("mongoose")
var Schema=mongoose.Schema
var courseSchema=new Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    weekday:{
        type: String,
    },
    startTime:{
        type: String,
    },
    endTime:{
        type: String,
    },
    faulty:{
        type: String,
    },
    students:[
        {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    
})
CourseModel = mongoose.model('Course', courseSchema);
module.exports = CourseModel