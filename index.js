const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const stdpostsRouter = require("./StudentData");
const postsRouter = require("./CollegesData");

const port = 5031;
const conn_str =
    "mongodb+srv://Adan:Pradan@adanpradan.thgia56.mongodb.net/Backend?retryWrites=true&w=majority";
mongoose.connect(
    conn_str,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => {
        if (err) {
            console.log("error in connection");
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
app.use("/AdanPradan", postsRouter);
app.use("/AdanPradan", stdpostsRouter);

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(port, function () {
    console.log("Runnning on " + port);
});
module.exports = app;
