const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookeParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

//  ROUTERS IMPORT
// const schoolRouter = require('./routers/school.router')
const classRouter = require('./routers/class.router.js')


const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use(cookeParser());

// mongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));



app.get("/", (req, res) => {
  res.send("Server is running at port :");
});
app.get("/test", (req, res) => {
  res.send({ id: 1, message: "Hello World" });
});

//  ROUTERS
// app.use("/api/school", schoolRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running at port :", PORT);
});
