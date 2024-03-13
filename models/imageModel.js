const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ImageDetailsSchema= new Schema(
  {
    image:String
  },
  { timestamps: true }
);

let imgPost = mongoose.model("ImageDetails", ImageDetailsSchema);

module.exports = imgPost;