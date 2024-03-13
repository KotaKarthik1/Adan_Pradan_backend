// const express = require("express");
// const router = express.Router();
// const imagedata = require("../models/imageModel");


// router.post("/upload-image", async (req, res, next) => {
//     const{base64}=req.body;
//     try {
//       imgPost.create({image:base64}); 
//       res.send({Status:"ok"})
//     } catch (err) {
//       next(err);
//       res.send({Staus:"error",data:error});
//     }
//   });

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const imgPost = require("../models/imageModel");
// const base64Img = require("base64-img");

// router.post("/upload-image", async (req, res, next) => {
//   const { base64 } = req.body;
//   try {
//     const path = "./public/images"; // Define the path where you want to save images
//     base64Img.img(base64, path, Date.now(), (err, filePath) => {
//       if (err) {
//         console.error("Error saving image:", err);
//         return res.status(500).json({ Status: "error", data: err });
//       }

//       imgPost.create({ image: filePath }, (error, image) => {
//         if (error) {
//           console.error("Error saving image to the database:", error);
//           return res.status(500).json({ Status: "error", data: error });
//         }

//         console.log("Image saved:", image);
//         res.status(200).json({ Status: "ok", data: image });
//       });
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ Status: "error", data: error });
//   }
// });



// router.get("/get-images", async (req, res, next) => {
//   try {
//     const images = await imgPost.find({});
//     res.status(200).json({ Status: "ok", data: images });
//   } catch (error) {
//     // Handle the error appropriately, e.g., by sending an error response
//     console.error("Error:", error);
//     res.status(500).json({ status: "error", data: error });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const imgPost = require("../models/imageModel");

router.post("/upload-image", async (req, res, next) => {
  const { base64 } = req.body;
  try {
    imgPost.create({ image: base64 }, (error, image) => {
      if (error) {
        console.error("Error saving image to the database:", error);
        return res.status(500).json({ Status: "error", data: error });
      }

      console.log("Image saved:", image);
      res.status(200).json({ Status: "ok", data: image });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ Status: "error", data: error });
  }
});

router.get("/get-images", async (req, res, next) => {
  try {
    const images = await imgPost.find({});
    res.status(200).json({ Status: "ok", data: images });
  } catch (error) {
    // Handle the error appropriately, e.g., by sending an error response
    console.error("Error:", error);
    res.status(500).json({ status: "error", data: error });
  }
});

module.exports = router;
