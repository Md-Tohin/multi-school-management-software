const { Router } = require("express");
const authMiddleware = require("../auth/auth");
const { createNotice, getAllNotices, getNoticeById, updateNotice, deleteNotice } = require("../controllers/notice.controller");

const router = Router();

router.post("/create", authMiddleware(['SCHOOL']), createNotice);
router.get("/all", authMiddleware(['SCHOOL']), getAllNotices);
router.get("/single/:id", authMiddleware(['SCHOOL']), getNoticeById);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateNotice);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteNotice);

module.exports = router;