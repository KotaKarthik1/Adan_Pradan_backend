 const express = require("express");
const router = express.Router();
const collegeData = require("../models/CollegeModel");

// Get all colleges
router.get("/colleges", async (req, res, next) => {
  try {
    const data = await collegeData.find({});
    res.json(data);
  } catch (err) {
    next(err);
  }
});
router.get("/colleges/list", async (req, res) => {
  try {
    let post = await collegeData.find();
    // console.log(post);
    res.status(200).json({
      status: 200,
      post,
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: err.message,
    });
  }
});
// Get college by ID
router.get("/colleges/:id", async (req, res, next) => {
  try {
    const data = await collegeData.findById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Create a new college
router.post("/colleges", async (req, res, next) => {
  try {
    const data = new collegeData(req.body);
    await data.save();
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Update a college by ID
router.put("/colleges/:id", async (req, res, next) => {
  try {
    const data = await collegeData.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Delete a college by ID
router.delete("/colleges/:id", async (req, res, next) => {
  try {
    const data = await collegeData.findByIdAndDelete(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
