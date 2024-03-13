const express = require("express");
const router = express.Router();
const BookingData=require("../models/BookingModel")
const WorkshopData=require("../models/WorkshopModel")
const studentdata = require("../models/StudentModel")
const collegeData = require("../models/CollegeModel");
router.post("/bookWorkshop", async (req, res) => {
    try {
        const { user, collegeName, workshopTitle, Date, slotTime, CollegeID } = req.body;
        console.log(user);
        console.log(collegeName);
        console.log(workshopTitle);
        console.log(Date);
        const existingBooking = await BookingData.findOne({ user, workshopTitle, Date });
        if (existingBooking) {
          return res.status(402).json({ message: 'User already has a booking for this workshop on the same date' });
        }
        const workshop = await WorkshopData.findOne({ 
          collegeName,
          workshopTitle: workshopTitle 
        });
    
        if (!workshop) {
          return res.status(400).json({message: 'Workshop not found'});
        }
      
        if (workshop.bookingNumber >= workshop.workshopSeats) {
          return res.status(401).json({message: 'No seats are available for this workshop'});
        }
    
        // Increment bookingNumber
        workshop.bookingNumber += 1;
        
        // Save the updated workshop document
        await workshop.save();
        console.log(workshop);
        const newBooking = new BookingData({
          user, 
          collegeName,
          workshopTitle,
          Date,
          slotTime,
          bookingNumber: workshop.bookingNumber, // Assign the current booking number
          collegeId:CollegeID
        });
        
        await newBooking.save();
        console.log(newBooking);

        res.status(201).json({message: 'Booking successful'});
    
      } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error booking workshop'});
      }
});
router.get("/bookWorkshop/bookingid", async(req, res)=>{
  // const workshop=

});
router.get("/userbooked/:id",async(req,res)=>
{ 
  try{
  const bookedByUser = await BookingData.find({ user: req.params.id });
  console.log(bookedByUser);
  res.json(bookedByUser);
  }
  catch{
    next(err);
  }
});
router.get("/collegebooked/:id",async(req,res)=>
{
  try{
    console.log(req.params.id);
    const Name = await collegeData.findOne({_id: req.params.id});
    const collegeName=Name.collegeName;
    console.log(collegeName);
    // res.json(bookingsForCollege);

    const workshopstosend=await BookingData.aggregate([
      {
      $match: {
        collegeName: collegeName, // Match the college name from the request
      }
      },
      {
        $group:{
          _id:'$workshopTitle',
          workshops:{$push:'$$ROOT'}
        }
      },
      {
      $lookup:{
        from:"studentdatas",
        localField: "workshops.user", // Field in booked referencing student ObjectIDs
        foreignField: "_id", // Field in Workshop
        as: "studentdetails",
      }
    }
    ]);
    // console.log(workshopstosend.studentdetails);
    console.log(workshopstosend);
    if(workshopstosend.length==0)
    {
      return res.status(404).json({message:`No bookings found for the ${collegename}`});
    }
    res.status(200).json(workshopstosend);
  }
  catch{
    res.status(500).json({error: 'Internal server error'})
  }
});
module.exports = router;