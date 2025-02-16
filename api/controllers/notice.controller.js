const Notice = require("../models/notice.model");

module.exports = {
  // CREATE NOTICE
  createNotice: async (req, res) => {
    try {
      const schoolId = req.user.schoolId;
      const { title, message, audience } = req.body;

      const createSubject = new Notice({
        school: schoolId,
        title: title,
        audience: audience,
        message: message,
      });

      await createSubject.save();
      res.status(201).json({
        message: "Successfully created the notice",
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error [CREATE NOTICE]",
        error: true,
        success: false,
      });
    }
  },
  // GET ALL NOTICES
  getAllNotices: async (req, res) => {
    try {
      const filterQuery = {};
      const schoolId = req.user.schoolId;

      filterQuery["school"] = schoolId;

      if (req.query.audience === "student") {
        filterQuery["audience"] = { $ne: "teacher" }; 
      } else if (req.query.audience === "teacher") {
        filterQuery["audience"] = { $ne: "student" }; 
      }

      const notices = await Notice.find(filterQuery);

      res.status(200).json({
        message: "Success in fetching all Notices",
        notices,
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error [GET ALL NOTICES]",
        error: true,
        success: false,
      });
    }
  },
  // GET NOTICE BY ID
  getNoticeById: async (req, res) => {
    try {
      const notice = await Notice.findById(req.params.id);
      if (!notice)
        return res.status(404).json({
          message: "Notice not found",
          error: true,
          success: false,
        });
      res.status(200).json({
        message: "Success in fetching Notice by ID",
        notice,
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error [GET NOTICE BY ID]",
        error: true,
        success: false,
      });
    }
  },
  // UPDATE NOTICE
  updateNotice: async (req, res) => {
    try {
      const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!notice)
        return res.status(404).json({
          message: "Notice not found",
          error: true,
          success: false,
        });
      res.status(200).json({
        message: "Successfully updated Notice",
        notice,
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error [UPDATE NOTICE]",
        error: true,
        success: false,
      });
    }
  },
  // DELETE NOTICE
  deleteNotice: async (req, res) => {
    try {
      const notice = await Notice.findByIdAndDelete(req.params.id);
      if (!notice)
        return res.status(404).json({
          message: "Notice not found",
          error: true,
          success: false,
        });
      res.status(200).json({
        message: "Successfully deleted Notice",
        error: false,
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal Server Error [DELETE NOTICE]",
        error: true,
        success: false,
      });
    }
  },
};
