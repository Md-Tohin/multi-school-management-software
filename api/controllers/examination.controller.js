const Examination = require("../models/examination.model")

module.exports = {
    //  CREATE EXAMINATION
    newExamination: async(req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const {examDate, subject, examType, selectedClass} = req.body;
            const newExamination = new Examination({
                school: schoolId,
                examDate,
                subject,
                examType,
                class:selectedClass
            })

            const newData = newExamination.save();
            return res.status(200).json({
                message: "Success in creating new Examination.",
                data: newData,
                error: false,
                success: true,
            })            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [CREATE EXAMINATION]",
                error: true,
                success: false,
            })
        }
    },
    //  GET ALL EXAMINATIONS
    getAllExaminations: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const examinations = await Examination.find({school: schoolId}).populate(['subject'])
            return res.status(200).json({
                message: "Success in fetching Examination.",
                examinations,
                error: false,
                success: true,
            })            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [GET EXAMINATIONS]",
                error: true,
                success: false,
            })
        }
    },
    //  GET EXAMINATIONS BY CLASS
    getExaminationsByClass: async (req, res) => {
        try {
            const schoolId = req.user.schoolId;
            const classId = req.params.id;
            console.log("class id: ", classId);
            
            const examinations = await Examination.find({school: schoolId, class: classId}).populate(['subject'])
            return res.status(200).json({
                message: "Success in fetching class Examination.",
                examinations,
                error: false,
                success: true,
            })            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [GET EXAMINATIONS BY CLASS]",
                error: true,
                success: false,
            })
        }
    },
    //  UPDATE EXAMINATION
    updateExaminationWithId: async (req, res) => {
        try {
            let id = req.params.id;            
            const schoolId = req.user.schoolId;
            const {examDate, subject, examType, selectedClass} = req.body;
            const updatedExamination = await Examination.findByIdAndUpdate(id, {
                school: schoolId,
                examDate,
                subject,
                examType,
                class: selectedClass
            }, {new: true})
            return res.status(200).json({
                message: "Success in updating Examination.",
                updatedExamination,
                error: false,
                success: true,
            })            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [UPDATE EXAMINATION]",
                error: true,
                success: false,
            })
        }
    },
    //  DELETE EXAMINATION
    deleteExaminationWithId: async (req, res) => {
        try {
            let id = req.params.id;
            const schoolId = req.user.schoolId;
            const deletedExamination = await Examination.findByIdAndDelete(id, {school: schoolId})
            return res.status(200).json({
                message: "Success in deleting Examination.",
                deletedExamination,
                error: false,
                success: true,
            })            
        } catch (error) {
            return res.status(500).json({
                message: "Internal Server Error [DELETE EXAMINATION]",
                error: true,
                success: false,
            })
        }
    },
}