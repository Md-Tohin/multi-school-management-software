require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Teacher = require("../models/teacher.model.js");

const generateTeacherId = (lastId="") => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
  const day = String(now.getDate()).padStart(2, '0'); // Ensure 2 digits

  let lastNumber = 1; // Default if no last ID
  if (lastId) {
      const lastFourDigits = parseInt(lastId.slice(-4), 10);
      lastNumber = lastFourDigits + 1;
  }

  const newId = `${year}${month}${day}${String(lastNumber).padStart(4, '0')}`;
  return newId;
};

module.exports = {
  //  TEACHER REGISTER
  registerTeacher: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;           
      const lastTeacherId = await Teacher.findOne({school: schoolId}, null, { sort: { _id: -1 } }).select("teacher_id");      
      const newTeacherId = generateTeacherId(lastTeacherId?.teacher_id);
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const teacher = await Teacher.findOne({ email: fields.email[0] });
        if (teacher) {
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
          process.env.TEACHER_IMAGE_PATH,
          originalFileName
        );
        let photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);

        const newTeacher = new Teacher({
          school: schoolId,
          teacher_id: newTeacherId,
          name: fields.name[0],
          email: fields.email[0],
          qualification: fields.qualification[0],
          address: fields.address[0],
          age: fields.age[0],
          salary: fields.salary[0],
          gender: fields.gender[0],
          phone: fields.phone[0],
          teacher_image: originalFileName,
          password: hashPassword,
        });

        const savedTeacher = await newTeacher.save();
        return res.status(200).json({
          data: savedTeacher,
          message: "Teacher is Registered Successfully!",
          success: true,
          error: false,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Teacher Registration Failed! [TEACHER REGISTER]",
        error: true,
        success: false,
      });
    }
  },
  //  TEACHER LOGIN
  loginTeacher: async (req, res) => {
    try {
      const teacher = await Teacher.findOne({ email: req.body.email });
      if (teacher) {
        const isAuth = bcrypt.compareSync(req.body.password, teacher.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign(
            {
              id: teacher._id,
              teacherId: teacher.teacher_id,
              schoolId: teacher.school,
              name: teacher.name,
              email: teacher.email,
              address: teacher.address,
              image_url: teacher.teacher_image,
              role: "TEACHER",
            },
            jwtSecret
          );
          res.header("Authorization", token);
          return res.status(200).json({
            success: true,
            error: false,
            message: "Login Success!",
            user: {
              id: teacher._id,
              schoolId: teacher.school,
              teacherId: teacher.teacher_id,
              email: teacher.email,
              address: teacher.address,
              name: teacher.name,
              image_url: teacher.teacher_image,
              role: "TEACHER",
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
  //  GET ALL TEACHER WITH FILTER
  getAllTeacherWithQuery: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;

      filterQuery["school"] = schoolId;
      if (req.query.hasOwnProperty("teacher_id")) {
        filterQuery["teacher_id"] = {
          $regex: req.query.teacher_id,
          $options: "i",
        };
      }
      if (req.query.hasOwnProperty("search")) {
        filterQuery["name"] = {
          $regex: req.query.search,
          $options: "i",
        };
      }
    //   if (req.query.hasOwnProperty("teacher_class")) {
    //     filterQuery["teacher_class"] = req.query.teacher_class;
    //   }
      const teachers = await Teacher.find(filterQuery)
        .select(["-password"])
      return res.status(200).json({
        success: true,
        error: false,
        teachers,
        message: "Success in fetching all teachers.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ ALL SCHOOL DATA ].",
      });
    }
  },
  //  GET TEACHER DETAILS
  getTeacherOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const schoolId = req.user.schoolId;

      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);
      if (teacher) {
        return res.status(200).json({
          success: true,
          error: false,
          teacher,
          message: "Success in fetching own teacher data.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Teacher not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ Own TEACHER DATA ].",
      });
    }
  },
  //  GET TEACHER DETAILS WITH ID
  getTeacherWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;

      const teacher = await Teacher.findOne({
        _id: id,
        school: schoolId,
      }).select(["-password"]);
      if (teacher) {
        return res.status(200).json({
          success: true,
          error: false,
          teacher,
          message: "Success in fetching own teacher data.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: true,
          message: "Teacher not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ Own TEACHER DATA ].",
      });
    }
  },
  //  UPDATE TEACHER
  updateTeacher: async (req, res) => {
    try {
      const id = req.params.id; //  auth middleware
      const schoolId = req.user.schoolId;
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const teacher = await Teacher.findOne({ _id: id, school: schoolId });        
        if (files.image) {
          const photo = files.image[0];
          let filepath = photo.filepath;
          let originalFileName = photo.originalFilename.replace(" ", "_");

          if (teacher.teacher_image) {
            let oldImagePath = path.join(
              __dirname,
              process.env.TEACHER_IMAGE_PATH,
              teacher.teacher_image
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath, (err) => {
                if (err) console.log("Error deleting old Image. ", err);
              });
            }
          }

          let newPath = path.join(
            __dirname,
            process.env.TEACHER_IMAGE_PATH,
            originalFileName
          );
          let photoData = fs.readFileSync(filepath);
          fs.writeFileSync(newPath, photoData);
          teacher["teacher_image"] = originalFileName;
        }
        Object.keys(fields).forEach((field) => {
          teacher[field] = fields[field][0];
        });
        await teacher.save();

        return res.status(200).json({
          success: true,
          error: false,
          message: "Teacher updated Successfully.",
          teacher,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "Teacher Updated Failed!",
        error: true,
        success: false,
      });
    }
  },
  //  DELETE TEACHER
  deleteTeacherWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      
      const teacher = await Teacher.findOne({ _id: id, school: schoolId }); 
      if (teacher.teacher_image) {
        let oldImagePath = path.join(
          __dirname,
          process.env.TEACHER_IMAGE_PATH,
          teacher.teacher_image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.log("Error deleting old Image. ", err);
          });
        }
      }
      
      await Teacher.findOneAndDelete({ _id: id, school: schoolId });
      const teachers = await Teacher.find({ school: schoolId });
      return res.status(200).json({
        message: "Teacher Deleted Successfully!",
        teachers,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ DELETE TEACHER ].",
      });
    }
  },
};
