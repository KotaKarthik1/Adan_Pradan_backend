const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    username:{
      type:String,
      required:true,
    },
    password:{
      type:String,
      required:true,
    },
    college:{
      type:String,
    },
    jntucode:{
      type:String,
    },
    description:{
      type:String,
    },
    numofseats:{
      type:Number,
    },
    workshops:{
      type:String,
    },
    bookings:{
      type:Number,
    }
  },
  { timestamps: true }
);

let Post = mongoose.model("CollegeData", postSchema);

module.exports = Post;