var express = require("express");
var path = require("path");
require("dotenv").config();
const cors = require("cors");


//const Sequelize = require("sequelize");

// ("use strict");
const getIP = require("external-ip")();

//const address = require("address");

var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var privateRouter = require("./routes/private");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRouter);
app.use("/api/pvt", privateRouter);

// const sequelize = new Sequelize(
//   "wadhain_apu",
//   "wadhain_codesandbox",
//   process.env.DBPASSWORD,
//   {
//     host: "csweb.in",
//     dialect: "mysql",
//   }
// );

// app.get("/db", async (req, res) => {
//   try {
//     getIP((err, ip) => {
//       if (err) {
//         console.log(err);
//       }
//       console.log(ip);
//     });
//     await sequelize.authenticate();
//     console.log("Connection has been established successfully.");
//     res.send("Connection to the database established successfully");
//   } catch (error) {
//     console.error("Unable to connect to the database:", error);
//     res.status(500).send("Unable to connect to the database");
//   }
// });

var listener = app.listen(8080, function () {
  console.clear();
  console.log("Listening on port " + listener.address().port);
});

// const cors = require("cors");

// var indexRouter = require("./routes/index");
// var privateRouter = require("./routes/private");

// var app = express();

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(cors());
