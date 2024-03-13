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

const ClgUser = mongoose.model('ClgUser',userSchema);

module.exports=ClgUser;