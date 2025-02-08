const { Router } = require("express");
const authMiddleware = require("../auth/auth");
const { createSchedule, updateScheduleWithId, deleteScheduleWithId, getScheduleWithClass, getScheduleWithId } = require("../controllers/schedule.controller");

const router = Router();

router.post("/create", authMiddleware(['SCHOOL']), createSchedule);
router.get("/fetch-with-class/:id", authMiddleware(['SCHOOL']), getScheduleWithClass);
router.get("/fetch/:id", authMiddleware(['SCHOOL']), getScheduleWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateScheduleWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteScheduleWithId);

module.exports = router;