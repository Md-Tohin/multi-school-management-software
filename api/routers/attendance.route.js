const { Router } = require("express");
const authMiddleware = require("../auth/auth");
const { markAttendance, getAttendance, checkAttendance, getAttendanceByStudentId, checkAttendanceByDate } = require("../controllers/attendance.controller");

const router = Router();

router.post("/mark", authMiddleware(['TEACHER']), markAttendance);
router.get("/all", authMiddleware(['SCHOOL']), getAttendance);
router.get("/fetch/:studentId", authMiddleware(['SCHOOL']), getAttendanceByStudentId);
router.patch("/check/:classId", authMiddleware(['SCHOOL']), checkAttendance);
router.get("/check-exists", authMiddleware(['TEACHER']), checkAttendanceByDate);

module.exports = router;