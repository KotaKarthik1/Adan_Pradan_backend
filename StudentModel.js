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
    confirmpassword:{
        type:String,
    },
    college:{
      type:String,
    },
    email:{
        type:String,
    },
    booked:{
      // type:Object,
      // properties:{
      //   collegename:String,
      //   labname:String,
      //   bookeddate:Date,
      // }
      bookingdata:{
        collegename:String,
        labname:String,
        bookeddate:Date,
      }
    }
  },
  { timestamps: true }
);

let stdPost = mongoose.model("StudentData", postSchema);

module.exports = stdPost;