require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../models/student.model.js");

module.exports = {
  //  STUDENT REGISTER
  registerStudent: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const student = await Student.findOne({ email: fields.email[0] });
        if (student) {
          return res.status(409).json({
            message: "Email is already registered!",
            error: true,
            success: false,
          });
        }
        const photo = files.image[0];
        let filepath = photo.filepath;
        let originalFileName = photo.originalFilename.replace(" ", "_");
        let newPath = path.join(
          __dirname,
          process.env.STUDENT_IMAGE_PATH,
          originalFileName
        );
        let photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);

        const newStudent = new Student({
          school: req?.user?.schoolId,
          name: fields.name[0],
          email: fields.email[0],
          student_class: fields.student_class[0],
          address: fields.address[0],
          age: fields.age[0],
          gender: fields.gender[0],
          guardian: fields.guardian[0],
          guardian_phone: fields.guardian_phone[0],
          student_image: originalFileName,
          password: hashPassword,
        });

        const savedStudent = await newStudent.save();
        return res.status(200).json({
          data: savedStudent,
          message: "Student is Registered Successfully!",
          success: true,
          error: false,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Student Registration Failed! [STUDENT REGISTER]",
        error: true,
        success: false,
      });
    }
  },
  //  STUDENT LOGIN
  loginStudent: async (req, res) => {
    try {
      const student = await Student.findOne({ email: req.body.email });
      if (student) {
        const isAuth = bcrypt.compareSync(req.body.password, student.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign(
            {
              id: student._id,
              studentId: student._id,
              schoolId: student.school,
              name: student.name,
              student_class: student.student_class,
              address: student.address,
              image_url: student.student_image,
              role: "STUDENT",
            },
            jwtSecret
          );
          res.header("Authorization", token);
          return res.status(200).json({
            success: true,
            error: false,
            message: "Login Success!",
            user: {
              id: student._id,
              schoolId: student.school,
              student_class: student.student_class,
              address: student.address,
              name: student.name,
              image_url: student.student_image,
              role: "STUDENT",
            },
          });
        } else {
          return res.status(401).json({
            message: "Password is Incorrect!",
            error: true,
            success: false,
          });
        }
      } else {
        return res.status(401).json({
          message: "Email is not Registered!",
          error: true,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [SCHOOL LOGIN]",
        error: true,
        success: false,
      });
    }
  },
  //  GET ALL STUDENT WITH FILTER
  getAllStudentWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;
      filterQuery['school'] = schoolId;
      if(req.query.hasOwnProperty('search')){
        filterQuery['name'] = {
          $regex: req.query.search, $option: "i"
        }
      }
      if(req.query.hasOwnProperty("student_class")){
        filterQuery['student_class'] = req.query.student_class;
      }
      const students = await Student.find(filterQuery).select([
        "-password",
      ]);
      return res.status(200).json({
        success: true,
        error: false,
        students,
        message: "Success in fetching all students.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ ALL SCHOOL DATA ].",
      });
    }
  },
  //  GET STUDENT DETAILS
  getStudentOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const schoolId = req.user.schoolId;

      const student = await Student.findOne({ _id: id, school: schoolId }).select(["-password"]);
      if (student) {
        return res.status(200).json({
          success: true,
          error: false,
          student,
          message: "Success in fetching own student data.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Student not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ Own STUDENT DATA ].",
      });
    }
  },
  //  GET STUDENT DETAILS WITH ID
  getStudentWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      const student = await Student.findOne({ _id: id, school: schoolId }).select(["-password"]);
      if (student) {
        return res.status(200).json({
          success: true,
          error: false,
          student,
          message: "Success in fetching own student data.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Student not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ Own STUDENT DATA ].",
      });
    }
  },
  //  UPDATE STUDENT
  updateStudent: async (req, res) => {
    try {
      const id = req.user.id; //  auth middleware
      const schooId = req.user.schoolId;

      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const student = await Student.findOne({ _id: id, school: schooId });

        if (files.image) {
          const photo = files.image[0];
          let filepath = photo.filepath;
          let originalFileName = photo.originalFilename.replace(" ", "_");

          if (student.student_image) {
            let oldImagePath = path.join(
              __dirname,
              process.env.STUDENT_IMAGE_PATH,
              student.student_image
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath, (err) => {
                if (err) console.log("Error deleting old Image. ", err);
              });
            }
          }

          let newPath = path.join(
            __dirname,
            process.env.STUDENT_IMAGE_PATH,
            originalFileName
          );
          let photoData = fs.readFileSync(filepath);
          fs.writeFileSync(newPath, photoData);
          student['student_image'] = originalFileName;
        }
        Object.keys(fields).forEach((field) => {
          student[field] = fields[field][0];
        });
        await student.save();

        return res.status(200).json({
          success: true,
          error: false,
          message: "Student updated Successfully.",
          student,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Student Updated Failed!",
        error: true,
        success: false,
      });
    }
  },
  //  DELETE STUDENT
  deleteStudentWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schooId;
      await Student.findOneAndDelete({_id: id, school: schoolId});
      const students = await Student.find({school: schoolId});
      return res.status(200).json({
        message: "Student Deleted Successfully!",
        students,
        error: false,
        success: true
      })
    } catch (error) {      
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ DELETE STUDENT ].",
      });
    }
  }
};
