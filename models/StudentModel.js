const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    userId:
    {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'StdUser',
        required:true,
    },
    name:
    {
      type:String,
    },
    
    collegeName:{
      type:String,
    }
  },
  { timestamps: true }
);

let stdPost = mongoose.model("StudentData", postSchema);

module.exports = stdPost;