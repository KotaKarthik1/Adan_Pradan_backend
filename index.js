const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
// const stdpostsRouter = require("./StudentData");
// const postsRouter = require("./CollegesData");
const port = process.env.PORT ||5031;
// const conn_str =process.env.DATABASE_URL;
// console.log(conn_str);
const studentsRoute = require("./routes/StudentAuth")
const collegesRoute = require("./routes/CollegeAuth");
const workshopRoute = require("./routes/CollegeWorkshops");
const collegelistsroute=require("./routes/CollegesData");
const bookingroute=require("./routes/BookingData");
const studentdata=require("./routes/StudentData");
// const imageRoute=require("./routes/imageData");
require('dotenv').config();

mongoose.connect(
    process.env.DATABASE_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.log("error in connection",err);
        } else {
            console.log("MONGDB is connected");
        }
    }
);
mongoose.set("strictQuery", true);

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use("/AdanPradan", postsRouter);
// app.use("/AdanPradan", stdpostsRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({ error: err.message });
});
app.use("/AdanPradan", collegesRoute);
app.use("/AdanPradan", studentsRoute);
app.use("/AdanPradan",workshopRoute);
app.use("/AdanPradan",collegelistsroute);
app.use("/AdanPradan",bookingroute);
app.use("/AdanPradan",studentdata);
// app.use("/AdanPradan",imageRoute);

// app.use((err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   res.status(err.status || 500);
//   res.json({ error: err.message });
// });

app.listen(port, function () {
    console.log("Runnning on " + port);
});
module.exports = app;
