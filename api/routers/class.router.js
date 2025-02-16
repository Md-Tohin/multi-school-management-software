const express = require('express');
const authMiddleware = require('../auth/auth');
const { createClass, getAllClasses, updateClassWithId, deleteClassWithId, getClassWithId } = require('../controllers/class.controller');

const router = express.Router();

router.post("/create", authMiddleware(['SCHOOL']), createClass);
router.get("/all", authMiddleware(['SCHOOL', 'TEACHER']), getAllClasses);
router.get("/single/:id", authMiddleware(['SCHOOL']), getClassWithId);
router.patch("/update/:id", authMiddleware(['SCHOOL']), updateClassWithId);
router.delete("/delete/:id", authMiddleware(['SCHOOL']), deleteClassWithId);

module.exports = router;