const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookeParser = require("cookie-parser");
const dotenv = require("dotenv");
dotenv.config();

//  ROUTERS IMPORT
const schoolRouter = require('./routers/school.router.js')
const classRouter = require('./routers/class.router.js')
const subjectRouter = require('./routers/subject.route.js')
const studentRouter = require('./routers/student.route.js')
const teacherRouter = require('./routers/teacher.route.js')
const scheduleRouter = require('./routers/schedule.route.js')
const attendanceRouter = require('./routers/attendance.route.js')

const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow requests from frontend
  credentials: true, // Allow cookies and Authorization headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  exposedHeaders: ["Authorization"],
};

app.use(cors(corsOptions));

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
app.use("/api/school", schoolRouter);
app.use("/api/class", classRouter);
app.use("/api/subject", subjectRouter);
app.use("/api/student", studentRouter);
app.use("/api/teacher", teacherRouter);
app.use("/api/schedule", scheduleRouter);
app.use("/api/attendance", attendanceRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server is running at port :", PORT);
});
