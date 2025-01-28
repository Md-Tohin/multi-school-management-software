require("dotenv").config();
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const School = require("../models/school.model.js");

module.exports = {
  registerSchool: async (req, res) => {
    try {
      const form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {  
        const school = await School.findOne({email: fields.email[0]});
        if(school){
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
          process.env.SCHOOL_IMAGE_PATH,
          originalFileName
        );
        let photoData = fs.readFileSync(filepath);
        fs.writeFileSync(newPath, photoData);

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(fields.password[0], salt);

        const newSchool = new School({
          school_image: originalFileName,
          school_name: fields.school_name[0],
          email: fields.email[0],
          owner_name: fields.owner_name[0],
          password: hashPassword,
        });

        const savedSchool = await newSchool.save();
        return res.status(200).json({
          data: savedSchool,
          message: "School is Registered Successfully!",
          success: true,
          error: false,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "School Registration Failed!",
        error: true,
        success: false,
      });
    }
  },
  loginSchool: async (req, res) => {
    try {
      const school = await School.findOne({ email: req.body.email });
      if (school) {
        const isAuth = bcrypt.compareSync(req.body.password, school.password);
        if (isAuth) {
          const jwtSecret = process.env.JWT_SECRET;
          const token = jwt.sign({
            id: school._id,
            schoolId: school._id,
            owner_name: school.owner_name,
            school_name: school.school_name,
            image_url: school.school_image,
            role: "SCHOOL",
          });
          res.header("Authorization", token);
          return res.status(200).json({
            success: true,
            error: false,
            message: "Login Success!",
            user: {
              id: school._id,
              owner_name: school.owner_name,
              school_name: school.school_name,
              image_url: school.school_image,
              role: "SCHOOL",
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
  getAllSchool: async (req, res) => {
    try {
      const schools = await School.find().select([
        "-password",
        "-email",
        "-owner_name",
        "-createdAt",
      ]);
      return res.status(200).json({
        success: true,
        error: false,
        schools,
        message: "Success in fetching all schools.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ ALL SCHOOL DATA ].",
      });
    }
  },
  getSchoolOwnData: async (req, res) => {
    try {
      const id = req.user.id;
      const school = await School.findOne({ _id: id });
      if (school) {
        return res.status(200).json({
          success: true,
          error: false,
          school,
          message: "Success in fetching own school data.",
        });
      } else {
        return res.status(404).json({
          success: false,
          error: true,
          message: "School not found.",
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: true,
        message: "Internal Server Error [ Own SCHOOL DATA ].",
      });
    }
  },
  updateSchool: async (req, res) => {
    try {
      const id = req.user.id; //  auth middleware
      const form = new formidable.IncomingForm();
      form.parse(req, async (res, fields, files) => {
        const school = await School.findOne({ _id: id });
        if (files.image) {
          const photo = files.image[0];
          let filepath = photo.filepath;
          let originalFileName = photo.originalFilename.replace(" ", "_");

          if (school.school_image) {
            let oldImagePath = path.join(
              __dirname,
              process.env.SCHOOL_IMAGE_PATH,
              school.school_image
            );
            if (fs.existsSync(oldImagePath)) {
              fs.unlink(oldImagePath, (err) => {
                if (err) console.log("Error deleting old Image. ", err);
              });
            }
          }

          let newPath = path.join(
            __dirname,
            process.env.SCHOOL_IMAGE_PATH,
            originalFileName
          );
          let photoData = fs.readFileSync(filepath);
          fs.writeFileSync(newPath, photoData);
        }

        Object.keys(fields).forEach((field) => {
          school[field] = fields[field][0];
        });
        await school.save();

        return res.status(200).json({
          success: true,
          error: false,
          message: "School updated Successfully.",
          school,
        });
      });
    } catch (error) {
      return res.status(500).json({
        message: "School Registration Failed!",
        error: true,
        success: false,
      });
    }
  },
};
