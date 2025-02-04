const express = require('express');
const authMiddleware = require('../auth/auth');
const { registerSchool, getAllSchool, loginSchool, updateSchool, getSchoolOwnData } = require('../controllers/school.controller');

const router = express.Router();

router.post('/register',authMiddleware(['SCHOOL']), registerSchool);
router.get('/all', authMiddleware(['SCHOOL']), getAllSchool);
router.post('/login', loginSchool);
router.patch('/update', authMiddleware(['SCHOOL']), updateSchool);
router.get('/fetch-single', authMiddleware(['SCHOOL']), getSchoolOwnData);

module.exports = router;