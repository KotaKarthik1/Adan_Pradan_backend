const express = require("express");
const Post = require("../models/StudentModel");
const router = express.Router();

router.post("/std", async (req, res) => {
  try {
    let post = new Post(req.body);
    post = await post.save();
    res.status(200).json({
      status: 200,
      data: post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.get("/std/list", async (req, res) => {
  try {
    let posts = await Post.find();
    res.status(200).json({
      status: 200,
      data: posts,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

router.get("/std/:postId", async (req, res) => {
  try {
    console.log(req.params.postId);
    let post = await Post.findOne({
      _id: req.params.postId,
      // username: req.params.username,
    });
    if (post) { 
      console.log(post);
      return res.status(200).json({
        status: 200,
        post,
      });
    }
    res.status(400).json({
      status: 400,
      message: "No post found",
    });
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  }
});
router.put("/std/:postId", async (req, res) => {
  try {
    let post = await Post.findByIdAndUpdate(req.params.postId, req.body, {
      new: true,
    });
    if (post) {
      res.status(200).json({
        status: 200,
        data: post,
      });
    }
    res.status(400).json({
      status: 400,
      message: "No post found",
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});
// router.get("/std/list/:id", async (req, res) => {
//   try {
//     let post = await Post.findOne({
//       _id: req.params.id,
//       // username: req.params.username,
//     });
//     res.status(200).json({
//       status: 200,
//       data: post,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 400,
//       message: err.message,
//     });
//   }
// });
router.delete("/std/:postId", async (req, res) => {
  try {
    let post = await Post.findByIdAndRemove(req.params.postId);
    if (post) {
      res.status(200).json({
        status: 200,
        message: "Post deleted successfully",
      });
    } else {
      res.status(400).json({
        status: 400,
        message: "No post found",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});

module.exports = router;
