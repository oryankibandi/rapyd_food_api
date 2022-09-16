const cluster = require("node:cluster");
const { cpus } = require("node:os");
const process = require("node:process");

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
const profileRoute = require("./routes/profileRoute");
const countriesRoute = require("./routes/countriesRoute");
const verifyToken = require("./middleware/verifyAccessToken");
const logRequests = require("./middleware/log_requests");

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  connect();
  //middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cors());
  app.use(logRequests);

  //route mapping
  app.use("/countries", countriesRoute);
  app.use("/user", userRoute);
  //verify token middleware
  app.use(verifyToken);

  app.use("/payments", paymentsRoute);
  app.use("/profile", profileRoute);

  mongoose.connection.once("open", () => {
    console.log("Connected to DB");
    app.listen(port, () => {
      console.log("Listening on port: " + port);
    });
  });

  console.log(`Worker ${process.pid} started`);
}
