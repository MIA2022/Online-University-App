var mongoose=require("mongoose")
var Schema=mongoose.Schema

const options = {
    discriminatorKey: 'kind',
};

const UserSchema = new Schema({
    username: {type:String, required: true},
    email: {type:String, unique:true, required: true },
    password: {type:String, required: true},
    courses:[
        {
            type: Schema.Types.ObjectId,
            ref: "Course"
        }
    ],
    comments:[
        {
            type: Schema.Types.ObjectId,
            ref: "comment"
        }
    ]
}, options);

//Define base model, then define other model objects based on this model:
const User = mongoose.model('User', UserSchema);

const Student = User.discriminator('Student', new Schema({
    grade: String,
}, options));

const Faulty = User.discriminator('Faulty', new Schema({
    college: String,
}, options));

module.exports = {
    StudentModel:Student,
    FaultyModel:Faulty,
    UserModel:User
}