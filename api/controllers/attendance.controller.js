const Attendance = require("../models/attendance.mode.js");
const moment = require('moment');

module.exports = {
    //  ADD ADDENDANCE
    markAttendance: async(req, res) => {
        try {
            const {studentId, date, status, classId } = req.body;
            const schoolId = req.user.schoolId;
            const newAttendance = new Attendance({
                school: schoolId,
                student: studentId,
                class: classId,
                date,
                status
            })
            await newAttendance.save()
            return res.status(200).json({
                message: "Successfully Mark Attendance",
                error: false,
                sccess: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [MARK ATTENDANCE]",
                error: true,
                sccess: false
            })
        }
    },
    //  GET ATTENDANCE
    getAttendance: async(req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const attendance = await Attendance.find({school: schoolId}).populate('student');
            return res.status(200).json({
                message: "Successfully fetch Attendance",
                attendance,
                error: false,
                sccess: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [GET ATTENDANCE]",
                error: true,
                sccess: false
            })
        }
    },

    //  GET ATTENDANCE BY STUDENT ID
    getAttendanceByStudentId: async(req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const {studentId} = req.params;
            const attendance = await Attendance.find({student: studentId, school: schoolId}).populate('student');
            return res.status(200).json({
                message: "Successfully fetch Attendance",
                attendance,
                error: false,
                sccess: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [GET ATTENDANCE]",
                error: true,
                sccess: false
            })
        }
    },

    //  CHECK ATTENDANCE
    checkAttendance: async(req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const today = moment().startOf('day');

            const attendanceForToday = await Attendance.findOne({
                school: schoolId,
                class: req.params.classId,
                date: {
                    $gte: today.toDate(),
                    $lt: moment(today).endOf('day').toDate()
                }
            })

            if (attendanceForToday) {
                return res.status(200).json({
                    message: "Attendance already taken",
                    attendanceTaken: true,
                    error: false,
                    sccess: true
                })
            } else {
                return res.status(200).json({
                    message: "No attendance taken yet for today",
                    attendanceTaken: false,
                    error: false,
                    sccess: true
                })
            }
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [CHECK ATTENDANCE]",
                error: true,
                sccess: false
            })
        }
    }

}