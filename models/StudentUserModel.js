const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    
});

const StudentUser = mongoose.model('StdUser',userSchema);

module.exports=StudentUser;