var mongoose=require("mongoose")

module.exports = {
    connectToServer:function(callback){
        mongoose.connect('mongodb://localhost:27017/final', function(err) {
            if (err) return callback(err);
            console.log('Database connection success...')
        });
    },
}