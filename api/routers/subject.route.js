const { Router } = require("express");
const authMiddleware = require("../auth/auth");
const { getAllSubject, createSubject, updateSubjectWithId, deleteSubjectWithId } = require("../controllers/subject.controller");

const router = Router();

router.post("/create", authMiddleware(['SCHOOL']), createSubject);
router.get("/all", authMiddleware(['SCHOOL']), getAllSubject);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateSubjectWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteSubjectWithId);

module.exports = router;