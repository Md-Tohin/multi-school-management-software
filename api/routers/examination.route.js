const { Router } = require("express");
const authMiddleware = require("../auth/auth");
const { newExamination, getAllExaminations, getExaminationsByClass, updateExaminationWithId, deleteExaminationWithId } = require("../controllers/examination.controller");

const router = Router();

router.post("/create", authMiddleware(['SCHOOL']), newExamination);
router.get("/all", authMiddleware(['SCHOOL']), getAllExaminations);
router.get("/fetch-with-class/:id", authMiddleware(['SCHOOL']), getExaminationsByClass);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateExaminationWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteExaminationWithId);

module.exports = router;