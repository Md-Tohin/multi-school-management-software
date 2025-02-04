const express = require('express');
const authMiddleware = require('../auth/auth');
const { registerStudent, getAllStudentWithQuery, loginStudent, updateStudent, getStudentOwnData, deleteStudentWithId, getStudentWithId } = require('../controllers/student.controller');

const router = express.Router();

router.post('/register', registerStudent);
router.get('/all', authMiddleware(['SCHOOL']), getAllStudentWithQuery);
router.post('/login', loginStudent);
router.patch('/update', authMiddleware(['SCHOOL']), updateStudent);
router.get('/fetch-single', authMiddleware(['STUDENT']), getStudentOwnData);
router.get('/fetch/:id', authMiddleware(['SCHOOL']), getStudentWithId);
router.delete('/delete/:id', authMiddleware(['SCHOOL']), deleteStudentWithId);

module.exports = router;