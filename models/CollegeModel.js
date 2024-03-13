
const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClgUser',
      required: true,
    },
    collegeName: {
      type: String,
      required: true,
      unique:true,
    },
    JntuCode:{
        type:String,
        required:true,
        unique:true,
    },
    Address:{
        type:String,
        required:true,
    },
    website:{
        type:String,
    },
    workshops:[{ type: mongoose.Schema.Types.ObjectId, ref: 'WorkshopModel' }],
  }
   
);

let clginfo = mongoose.model("CollegeData", postSchema);

module.exports = clginfo;



  
  
  