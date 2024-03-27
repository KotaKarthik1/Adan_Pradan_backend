const express = require("express");
const router = express.Router();
const WorkshopData = require("../models/WorkshopModel");
const ClgInfo = require("../models/CollegeModel");
const { route } = require("..");
const workshop = require("../models/WorkshopModel");
const BookingData=require("../models/BookingModel");

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
  const today = new Date();
  const formattedDate2 = `${today.getFullYear()}-${(today.getMonth() + 1 + '').padStart(2, '0')}-${(today.getDate() + '').padStart(2, '0')}T00:00:00.000Z`;
console.log(formattedDate2);
  console.log(today);
  
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
        "workshopDetails.workshopDate": { $gte: new Date(formattedDate2) }, // Filter workshops with date greater than or equal to today
      },
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
  const Name = await ClgInfo.findOne({ _id: req.params.userid });
  const collegeName = Name.collegeName;
  const currentDate = new Date(); // Get the current date
  const today = new Date();
  const formattedDate2 = `${today.getFullYear()}-${(today.getMonth() + 1 + '').padStart(2, '0')}-${(today.getDate() + '').padStart(2, '0')}T00:00:00.000Z`;
console.log(formattedDate2);
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
        "workshopDetails.workshopDate": { $gte: new Date(formattedDate2) }, // Filter workshops with date greater than or equal to current date
      },
    },
    {
      $project: {
        collegeName: 1, // Include collegeName from ClgInfo
        workshop_id: "$workshopDetails._id", // Add workshop_id field with the ID of the workshop
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
      // result will contain documents with collegeName, workshop_id, and workshopTitle
    }
  });
});
// Update the route to accept workshopId and userId as parameters
// router.delete("/deleteworkshops", async (req, res) => {
//   const { workshopId, userId } = req.body;
//   console.log(workshopId);
//   console.log(userId);
//   try {
//     // Find the CollegeData document by userId
//     WorkshopData.findOneAndDelete({ _id: workshopId })
//   .then(async (deletedWorkshop) => {
//     if (!deletedWorkshop) {
//       return res.status(404).json({ message: 'Workshop not found' });
//     }

//     // Update CollegeData's workshops array
//     await ClgInfo.findOneAndUpdate(
//       { _id: deletedWorkshop.college },
//       { $pull: { workshops: deletedWorkshop._id } }
//     );

//     res.status(200).json({ message: 'Workshop deleted successfully' });
//   })
//   } catch (error) {
//     console.error('Error deleting workshop:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });

// router.delete("/deleteworkshops", async (req, res) => {
//   const { workshopId, userId } = req.body;
//   console.log(workshopId);
//   console.log(userId);
//   try {
//     // Find the deleted workshop
//     const clgdetail=await ClgInfo.findOne({_id:userId});
//     console.log(clgdetail," is clg detail");

//     const deletedWorkshop = await WorkshopData.findOneAndDelete({ _id: workshopId });
//     // console.log(deletedWorkshop);
//     if (!deletedWorkshop) {
//       return res.status(404).json({ message: 'Workshop not found' });
//     }
//     console.log(deletedWorkshop," is workshop");
//     // Find bookings that match the deleted workshop's information
//     const date = new Date(deletedWorkshop.workshopDate);
//     date.setDate(date.getDate());
//     const formattedDate2 = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(date.getDate() + '').padStart(2, '0')}T00:00:00.000Z`;
//     console.log(formattedDate2);
//     const matchingBookings = await BookingData.find({
//       // workshop_id: workshopId,
//       workshopTitle: deletedWorkshop.workshopTitle,
//       Date: new Date(formattedDate2),
//       collegeName:clgdetail.collegeName
//     });
//     console.log(matchingBookings);
//     // Extract user_ids from matching bookings
//     const userIds = matchingBookings.map(booking => booking._id);
// const deletebookings = await BookingData.deleteMany({ _id: { $in: userIds } });
    
//     // Return the array of user_ids
//     console.log(userIds);
//     res.status(200).json({ deletedWorkshops: deletebookings, message: 'Workshop deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting workshop:', error);
//     res.status(500).json({ message: 'Internal Server Error' });
//   }
// });
router.delete("/deleteworkshops", async (req, res) => {
  const { workshopId, userId } = req.body;
  console.log(workshopId);
  console.log(userId);
  try {
    // Find the deleted workshop
    const clgdetail = await ClgInfo.findOne({ _id: userId });
    console.log(clgdetail, " is clg detail");

    const deletedWorkshop = await WorkshopData.findOneAndDelete({ _id: workshopId });
    // console.log(deletedWorkshop);
    if (!deletedWorkshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }
    console.log(deletedWorkshop, " is workshop");
    // Find bookings that match the deleted workshop's information
    const date = new Date(deletedWorkshop.workshopDate);
    date.setDate(date.getDate());
    const formattedDate2 = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(date.getDate() + '').padStart(2, '0')}T00:00:00.000Z`;
    console.log(formattedDate2);
    const matchingBookings = await BookingData.find({
      // workshop_id: workshopId,
      workshopTitle: deletedWorkshop.workshopTitle,
      Date: new Date(formattedDate2),
      collegeName: clgdetail.collegeName
    });
    console.log(matchingBookings);
    // Extract user_ids from matching bookings
    const userIds = matchingBookings.map(booking => booking._id);
    const deletebookings = await BookingData.deleteMany({ _id: { $in: userIds } });

    // Update college data to remove the deleted workshop from the workshops array
    await ClgInfo.findOneAndUpdate({ _id: userId }, { $pull: { workshops: workshopId } });

    // Return the array of user_ids
    console.log(userIds);
    res.status(200).json({ deletedWorkshops: deletebookings, message: 'Workshop deleted successfully' });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.delete("/pullallworkshops/", async (req, res) => {
  const collegeId = req.body.collegeId;
  console.log(collegeId);
  try {
    // Find the college by ID
    const college = await ClgInfo.findOne({ _id: collegeId });
    if (!college) {
      return res.status(404).json({ message: 'College not found' });
    }

    // Update the college's workshops array to an empty array
    college.workshops = [];
    await college.save();

    res.status(200).json({ message: 'All workshops deleted successfully' });
  } catch (error) {
    console.error('Error deleting workshops:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;
