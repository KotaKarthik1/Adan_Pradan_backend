const express = require("express");
const router = express.Router();
const BookingData = require("../models/BookingModel");
const WorkshopData = require("../models/WorkshopModel");
const studentdata = require("../models/StudentModel");
const collegeData = require("../models/CollegeModel");
router.post("/bookWorkshop", async (req, res) => {
  try {
    const { user, collegeName, workshopTitle, Date, slotTime, collegeId } =
      req.body;
    console.log(req.body);
    const workshop_id = req.body.workshopid;
    console.log(user);
    console.log(collegeName);
    console.log(workshopTitle);
    console.log(Date);
    console.log(workshop_id, " is workshop id");
    const existingBooking = await BookingData.findOne({
      user,
      collegeId,
      workshopTitle,
      Date,
    });
    if (existingBooking) {
      console.log("already had");
      return res
        .status(402)
        .json({
          message:
            "User already has a booking for this workshop on the same date",
        });
    }
    const workshop = await WorkshopData.findOne({
      _id: workshop_id,
    });
    console.log(workshop);
    if (workshop.workshopDate.toISOString().split("T")[0] != Date) {
      console.log("Dates do not match");
      return res
        .status(400)
        .json({
          message: `Workshop is only availiable on ${workshop.workshopDate}`,
        });
    }
    if (!workshop) {
      console.log("No such workshop found");
      return res.status(400).json({ message: "Workshop not found" });
    }

    if (workshop.bookingNumber >= workshop.workshopSeats) {
      console.log("no seats availiable");
      return res
        .status(401)
        .json({ message: "No seats are available for this workshop" });
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
      collegeId: collegeId,
    });

    await newBooking.save();
    console.log(newBooking);

    res.status(201).json({ message: "Booking successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error booking workshop" });
  }
});
// router.get("/bookWorkshop/bookingid", async(req, res)=>{
//   // const workshop=

// });
router.get("/userbooked/:id", async (req, res) => {
  try {
    const bookedByUser = await BookingData.find({ user: req.params.id });
    console.log(bookedByUser);
    res.json(bookedByUser);
  } catch {
    // next(err);
    res.status(500).json({ error: "booking server error" });
  }
});
router.get("/collegebooked/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const Name = await collegeData.findOne({ _id: req.params.id });
    const collegeName = Name.collegeName;
    console.log(collegeName);
    // res.json(bookingsForCollege);

    const workshopstosend = await BookingData.aggregate([
      {
        $match: {
          collegeName: collegeName, // Match the college name from the request
        },
      },
      {
        $group: {
          _id: "$workshopTitle",
          workshops: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "studentdatas",
          localField: "workshops.user", // Field in booked referencing student ObjectIDs
          foreignField: "_id", // Field in Workshop
          as: "studentdetails",
        },
      },
    ]);
    // console.log(workshopstosend.studentdetails);
    console.log(workshopstosend);
    if (workshopstosend.length == 0) {
      return res
        .status(404)
        .json({ message: `No bookings found for the ${collegename}` });
    }
    res.status(200).json(workshopstosend);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/cancelBooking/:id", async (req, res) => {
  try {
    const bookingid = req.params.id;
    const bookingdetail = await BookingData.findByIdAndDelete(bookingid);
    if (!bookingdetail) {
      return res
        .status(404)
        .json({ message: `The booking with id=${bookingid} is not available` });
    } else {
      console.log("deleted successfully");
      return res
        .status(200)
        .json({ message: `successfully deleted with ${bookingid}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send(error.toString());
  }
});
router.get("/collegebooked/todaylist/:id", async (req, res) => {
  try {
    const date = new Date();
date.setDate(date.getDate());
const formattedDate2 = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(date.getDate() + '').padStart(2, '0')}T00:00:00.000Z`;
console.log(formattedDate2);
const Name = await collegeData.findOne({ _id: req.params.id });
const collegeName = Name.collegeName;

const workshopstosend = await BookingData.aggregate([
  {
    $match: {
      collegeName: collegeName,
      Date: new Date(formattedDate2),
    },
  },
  {
    $group: {
      _id: "$workshopTitle",
      Date: { $first: "$Date" },
      workshops: { $push: "$$ROOT" },
    },
  },
  {
    $lookup: {
      from: "studentdatas",
      localField: "workshops.user",
      foreignField: "_id",
      as: "studentdetails",
    },
  },
]);

// const newArray = workshopstosend.map(item => ({
//   heading: `${item._id} - ${new Date(item.Date).toDateString()}`,
//   workshops: item.workshops.map(workshop => ({
//     workshopName: workshop.workshopTitle,
//     date: new Date(workshop.Date).toDateString(),
//     students: item.studentdetails.map(student => ({
//       name: student.name,
//       collegeName: student.collegeName
//     }))
//   }))
// }));

    // console.log(filteredWorkshops);
    const convertedData = workshopstosend.map((workshop) => ({
      _id: workshop._id,
      date: workshop.Date,
      students: workshop.studentdetails.map((student) => ({
        name: student.name,
        collegeName: student.collegeName,
      })),
    }));

    if (workshopstosend.length == 0) {
      return res
        .status(404)
        .json({ message: `No bookings found for the ${collegeName}` });
    }
    res.status(200).json(convertedData);
  }
     catch (error) {
    res.status(500).send(error.toString());
  }
});

router.get("/bookingsfilterbydate", async (req, res) => {
  try {
    console.log("em roo");
    console.log(req.query);
    // const id=req.params.id;
    const { id, checkdate } = req.query;
    // const checkdate=req.params.checkdate;
    console.log(id,checkdate);
    const AllBookedDetails = await BookingData.find({ collegeId: id, Date: new Date(checkdate) });
    console.log(AllBookedDetails);
    if(AllBookedDetails)
    {
      // const userIds = AllBookedDetails.map(booking => booking.user);
      // const users = await studentdata.find({ _id: { $in: userIds } });
      // console.log(users);
      // return res.status(200).json(AllBookedDetails);
      const workshops = {};
          await Promise.all(AllBookedDetails.map(async (booking) => {
            if (!workshops[booking.workshopTitle]) {
              workshops[booking.workshopTitle] = [];
            }
            const user = await studentdata.findOne({ _id: booking.user });
            workshops[booking.workshopTitle].push({
              user:user.name,
              studentclgName: user.collegeName,
              Date: booking.Date,
              slotTime: booking.slotTime
            });
          }));
          console.log(workshops);
          return res.status(200).json(workshops);
    }

    return res.status(400).json(message="em lev saami");
  } catch {
    // next(err);
    res.status(500).json({ error: "cannot find the details by that date" });
  }
});

router.get('/bookingsfilterbydatepast',async(req,res)=>
{
  try{
    console.log(req.query);
    // const id=req.params.id;
    const { id, checkdate } = req.query;
    // const checkdate=req.params.checkdate;
    console.log(id,checkdate);
    const AllBookedDetails = await BookingData.find({ collegeId: id, Date: { $lt: new Date(checkdate) } });
    console.log(AllBookedDetails);
    if(AllBookedDetails)
    {
      // const userIds = AllBookedDetails.map(booking => booking.user);
      // const users = await studentdata.find({ _id: { $in: userIds } });
      // console.log(users);
      // return res.status(200).json(AllBookedDetails);
      const datesfilteredbookings = {};
          await Promise.all(AllBookedDetails.map(async (booking) => {
            if (!datesfilteredbookings[booking.Date]) {
              datesfilteredbookings[booking.Date] = [];
            }
            const user = await studentdata.findOne({ _id: booking.user });
            datesfilteredbookings[booking.Date].push({
              user:user.name,
              studentclgName: user.collegeName,
              Date: booking.workshopTitle,
              slotTime: booking.slotTime
            });
          }));
          console.log(datesfilteredbookings);
          return res.status(200).json(datesfilteredbookings);
    }

    return res.status(400).json(message="no bookings found");
  } catch {
    // next(err);
    res.status(500).json({ error: "error occured at backend" });
  }
});
router.get('/bookingsfilterbydateupcoming',async(req,res)=>
{
  try{
    console.log(req.query);
    // const id=req.params.id;
    const { id, checkdate } = req.query;
    // const checkdate=req.params.checkdate;
    console.log(id,checkdate);
    const AllBookedDetails = await BookingData.find({ collegeId: id, Date: { $gte: new Date(checkdate) } });
    console.log(AllBookedDetails);
    if(AllBookedDetails)
    {
      // const userIds = AllBookedDetails.map(booking => booking.user);
      // const users = await studentdata.find({ _id: { $in: userIds } });
      // console.log(users);
      // return res.status(200).json(AllBookedDetails);
      const datesfilteredbookings = {};
          await Promise.all(AllBookedDetails.map(async (booking) => {
            if (!datesfilteredbookings[booking.Date]) {
              datesfilteredbookings[booking.Date] = [];
            }
            const user = await studentdata.findOne({ _id: booking.user });
            datesfilteredbookings[booking.Date].push({
              user:user.name,
              studentclgName: user.collegeName,
              Date: booking.workshopTitle,
              slotTime: booking.slotTime
            });
          }));
          console.log(datesfilteredbookings);
          return res.status(200).json(datesfilteredbookings);
    }

    return res.status(400).json(message="no bookings found");
  } catch {
    // next(err);
    res.status(500).json({ error: "error occured at backend" });
  }
});

module.exports = router;
