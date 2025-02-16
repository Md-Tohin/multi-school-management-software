const Exam = require("../models/examination.model");
const Subject = require("../models/subject.model");
const Schedule = require("../models/schedule.model");

module.exports = {
  //  GET SCHEDULES
  getScheduleWithClass: async (req, res) => {
    try {
      const classId = req.params.id;      
      const schoolId = req.user.schoolId;
      const schedules = await Schedule.find({
        school: schoolId,
        class: classId,
      }).populate(['teacher', 'subject']);
      return res.status(200).json({
        message: "Schedule in fetching Schedules",
        schedules,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [GET SCHEDULE]",
        error: true,
        success: false,
      });
    }
  },
  //  GET SCHEDULES WITH TEASER ID
  getScheduleWithTeacher: async (req, res) => {
    try {

      const filterQuery = {};
      const schoolId = req.user.schoolId;
      const teacherId = req.user.id;

      filterQuery["school"] = schoolId;
      filterQuery["teacher"] = teacherId;
      const classId = req.params.id;  
      if (classId !== "all") {
        filterQuery["class"] = classId;
      }      
      const schedules = await Schedule.find(filterQuery).populate(['teacher', 'subject']);
      return res.status(200).json({
        message: "Schedule in fetching Schedules",
        schedules,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [GET SCHEDULE WITH TEACHER]",
        error: true,
        success: false,
      });
    }
  },
  //  CREATE SCHEDULE
  createSchedule: async (req, res) => {
    try {
      const createSchedule = new Schedule({
        school: req.user.schoolId,
        teacher: req.body.teacher,
        subject: req.body.subject,
        class: req.body.selectedClass,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
      await createSchedule.save();
      return res.status(200).json({
        message: "Schedule Created Successfully!",
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [CREATE SCHEDULE]",
        error: true,
        success: false,
      });
    }
  },
  //  GET SCHEDULE WITH ID
  getScheduleWithId: async (req, res) => {
    try {
      const id = req.params.id;      
      const schoolId = req.user.schoolId;
      const schedule = await Schedule.find({
        school: schoolId,
        _id: id,
      }).populate(['teacher', 'subject']);
      return res.status(200).json({
        message: "Schedule in fetching schedule with id",
        schedule,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [GET SCHEDULE WITH ID]",
        error: true,
        success: false,
      });
    }
  },
  //  UPDATE SCHEDULE
  updateScheduleWithId: async (req, res) => {
    try {
      const id = req.params.id;
      const schoolId = req.user.schoolId;
      await Schedule.findOneAndUpdate(
        { _id: id },
        {
          $set: { ...req.body },
        }
      );
      const scheduleAfterUpdate = await Schedule.findOne({ _id: id });
      return res.status(200).json({
        message: "Schedule Updated Successfully!",
        data: scheduleAfterUpdate,
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [SCHEDULE UPDATE].",
        error: true,
        success: false,
      });
    }
  },
  //  DELETE SCHEDULE
  deleteScheduleWithId: async (req, res) => {
    try {
      let id = req.params.id;
      const schoolId = req.user.schoolId;

      await Schedule.findOneAndDelete({ school: schoolId, _id: id });
      return res.status(200).json({
        message: "Schedule Deleted Successfully.",
        error: false,
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error [DELETE SCHEDULE]",
        error: true,
        success: false,
      });
    }
  },
};
