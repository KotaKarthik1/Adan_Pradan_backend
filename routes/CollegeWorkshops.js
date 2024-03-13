const express = require("express");
const router = express.Router();
const WorkshopData = require("../models/WorkshopModel");
const ClgInfo = require("../models/CollegeModel");
const { route } = require("..");
const workshop = require("../models/WorkshopModel");

router.post("/addworkshops", async (req, res) => {
  try {
    const workshops = req.body.workshops;
    console.log("Sample", workshops);

    // Create Workshop documents for each workshop
    const workshopData = workshops.map((workshop) => ({
      college: workshop.college,
      workshopTitle: workshop.workshopTitle,
      workshopDate: workshop.workshopDate,
      workshopSeats: workshop.workshopSeats,
      workshopTiming: workshop.workshopTiming,
      // Other workshop-related fields
    }));

    // Save the Workshop documents
    const savedWorkshops = await WorkshopData.insertMany(workshopData);
    console.log(savedWorkshops);
    // Assuming the college is the same for all workshops, you can use the first workshop's college ID
    const collegeId = workshopData[0].college;
    console.log(collegeId);
    // Find the ClgInfo document by userId
    const college = await ClgInfo.findOne({ _id: collegeId });
    console.log(college);
    if (!college) {
      return res
        .status(404)
        .json({ error: "College not found for the given userId" });
    }

    const workshopIds = savedWorkshops.map((workshop) => workshop._id);
    console.log(workshopIds);
    // Add the workshop's _id to the ClgInfo's workshops array
    college.workshops = college.workshops.concat(workshopIds);

    // Save the updated ClgInfo document
    const updatedCollege = await college.save();

    // Log the workshop IDs and the updated college
    console.log("Workshop IDs:", workshopIds);
    console.log("Updated College:", updatedCollege);

    res.status(201).json(savedWorkshops);
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ error: "Could not create the workshop" });
  }
});

router.get("/fullclgdata", async (req, res) => {
  // console.log(workshops);
  const aggregatePipeline = [
    {
      $lookup: {
        from: "workshops", // Name of the Workshop collection
        localField: "workshops", // Field in ClgInfo referencing Workshop ObjectIDs
        foreignField: "_id", // Field in Workshop
        as: "workshopDetails",
      },
    },
    {
      $unwind: "$workshopDetails",
    },
    {
      $project: {
        collegeName: 1, // Include collegeName from ClgInfo
        workshopTitle: "$workshopDetails.workshopTitle", // Include workshopTitle from Workshop
        workshopSeats: "$workshopDetails.workshopSeats",
        workshopDate: "$workshopDetails.workshopDate",
        booking: "$workshopDetails.bookingNumber",
      },
    },
  ];

  // Execute the aggregation pipeline
  ClgInfo.aggregate(aggregatePipeline, (err, result) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      res.json(result);
      // console.log(result);
      // result will contain documents with collegeName and workshopTitle
    }
  });
});
router.get("/workshopsforclg/:userid", async (req, res) => {
  // const id = req.params.userid;
  // Assuming yourStringId is the string representation of ObjectID

  // Now, objectId is an instance of ObjectId and can be used in Mongoose queries

  
  const Name = await ClgInfo.findOne({ _id: req.params.userid});
  const collegeName = Name.collegeName;

  const aggregatePipeline = [
    {
      $lookup: {
        from: "workshops", // Name of the Workshop collection
        localField: "workshops", // Field in ClgInfo referencing Workshop ObjectIDs
        foreignField: "_id", // Field in Workshop
        as: "workshopDetails",
      },
    },
    {
      $unwind: "$workshopDetails",
    },
    {
      $match: {
        collegeName: collegeName, // Match the college name from the request
      },
    },
    {
      $project: {
        collegeName: 1, // Include collegeName from ClgInfo
        workshopTitle: "$workshopDetails.workshopTitle", // Include workshopTitle from Workshop
        workshopSeats: "$workshopDetails.workshopSeats",
        workshopDate: "$workshopDetails.workshopDate",
        Bookingcount: "$workshopDetails.bookingNumber",
      },
    },
  ];

  // Execute the aggregation pipeline
  ClgInfo.aggregate(aggregatePipeline, (err, result) => {
    if (err) {
      console.error(err);
      // Handle error
    } else {
      res.json(result);
      console.log(result);
      // result will contain documents with collegeName and workshopTitle
    }
  });
});

module.exports = router;
