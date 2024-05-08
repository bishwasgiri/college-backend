const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const adminRoutes = require("../backend/router/router");
const eventRoutes = require("../backend/router/router");
const cors = require("cors");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));

//routes
app.use("/api/admin", adminRoutes);

app.use("/api/event", eventRoutes);

// connecting to database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("eror on connecting to database", error);
  });
