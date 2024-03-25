
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    collegeName: {
      type: String,
      required: true,
      unique:true,
    },
    workshopDate: {
        type:Date,
        required:true,
      },
      workshopTiming: {
        type: String,
      },
      workshopTitle: {
        type: String,
        required: true,
      }
  }
   
);

let clginfo = mongoose.model("CollegeData", postSchema);

module.exports = clginfo;



  
  
  