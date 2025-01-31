const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");
const Subject = require("../models/subject.model");

module.exports = {
  //  GET SUBJECTS
  getAllSubject: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const allSubjects = await Subject.find({ school: schoolId });
      return res.status(200).json({
        message: "Subject in fetching all Subjects",
        allSubjects,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [GET SUBJECT]",
        error: true,
        success: false,
      });
    }
  },
  //  CREATE SUBJECT
  createSubject: async (req, res) => {
    try {
      const createSubject = new Subject({
        school: req.user.schoolId,
        subject_name: req.body.subject_name,
        subject_codename: req.body.subject_codename,
      });
      await createSubject.save();
      return res.status(200).json({
        message: "Subject Created Successfully!",
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [CREATE SUBJECT]",
        error: true,
        success: false,
      });
    }
  },
  //  UPDATE SUBJECT
  updateSubjectWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Subject.findOneAndUpdate(
        { _id: id },
        {
          $set: {...req.body},
        }
      );
      const subjectAfterUpdate = await Subject.findOne({ _id: id });
      return res.status(200).json({
        message: "Subject Updated Successfully!",
        data: subjectAfterUpdate,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [SUBJECT UPDATE].",
        error: true,
        success: false,
      });
    }
  },
  //  DELETE SUBJECT
  deleteSubjectWithId: async (req, res) => {
    try {
      let id = req.params.id;
      const schoolId = req.user.schoolId;
      const subjectExamCount = (await Exam.find({ school: schoolId, subject: id })).length;
      const subjectScheduleCount = (await Schedule.find({ school: schoolId, subject: id })).length;
      if ((subjectExamCount === 0) && (subjectScheduleCount === 0)) {
        await Subject.findOneAndDelete({ school: schoolId, _id: id });
        return res.status(200).json({
          message: "Subject Deleted Successfully.",
          error: false,
          success: true,
        });
      } else {
        return res.status(401).json({
          message: "This Subject is already in Use",
          error: true,
          success: false,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [DELETE SUBJECT]",
        error: true,
        success: false,
      });
    }
  },
};
