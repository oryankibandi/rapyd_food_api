require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const mongoose = require("mongoose");

const connect = require("./config/connectDB");
const userRoute = require("./routes/userRoute");
const paymentsRoute = require("./routes/paymentRoute");
const verifyToken = require("./middleware/verifyAccessToken");
const logRequests = require("./middleware/log_requests");

connect();
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(logRequests);
//route mapping
app.use("/user", userRoute);
app.use(verifyToken);

app.use("/payments", paymentsRoute);

mongoose.connection.once("open", () => {
  console.log("Connected to DB");
  app.listen(port, () => {
    console.log("Listening on port: " + port);
  });
});
