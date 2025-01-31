const Class = require("../models/class.model");
const Student = require("../models/student.model");
const Exam = require("../models/examination.model");
const Schedule = require("../models/schedule.model");

module.exports = {
    //  GET CLASS
    getAllClasses: async(req, res) => {    
        try {
            const schoolId = req.user.schoolId;
            const allClasses = await Class.find({school: schoolId});
            return res.status(200).json({
                message: "Success in fetching all Classes.",
                data: allClasses,
                error: false,
                success: true
            })            
        } catch (error) {
            console.log(error);            
            return res.status(500).json({
                message: "Internal Server Error [GET CLASS].",
                error: true,
                success: false,
            })
        }
    },
    //  CREATE CLASS
    createClass: async(req, res) => {
        try {
            const createClass = new Class({
                school: req.user.schoolId,
                class_text: req.body.class_text,
                class_num: req.body.class_num
            })
            const result = await createClass.save();
            return res.status(200).json({
                message: "Successfully created the Class.",
                data: result,
                error: false,
                success: true
            });
        } catch (error) {
            console.log(error);            
            return res.status(500).json({
                message: "Internal Server Error [CREATE CLASS].",
                error: true,
                success: false,
            })
        }
    },
    //  UPDATE CLASS
    updateClassWithId: async(req, res) => {
        try {
            let id = req.params.id;            
            await Class.findOneAndUpdate({_id: id}, {
                $set: {...req.body}
            });
            const classAfterUpdate = await Class.findOne({_id: id});
            return res.status(200).json({
                message: "Successfully updated the Class.",
                data: classAfterUpdate,
                error: false,
                success: true
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal Server Error [UPDATE CLASS].",
                error: true,
                success: false,
            })
        }
    },
    //  DELETE CLASS
    deleteClassWithId: async(req, res) => {
        try {
            let id = req.params.id;
            const schoolId = req.user.schoolId;            

            const classStudentCount = (await Student.find({school: schoolId, student_class: id})).length;
            const classExamCount = (await Exam.find({class: id, school: schoolId})).length;
            const classScheduleCount = (await Schedule.find({class: id, school: schoolId})).length;
            
            if(classStudentCount === 0 && classExamCount === 0 && classScheduleCount === 0){
                await Class.findOneAndDelete({_id: id, school: schoolId});            
                return res.status(200).json({
                    message: "Class Deleted Successfully.",
                    error: false,
                    success: true
                });
            }
            else{
                return res.status(401).json({
                    message: "This Class is already in use.",
                    error: true,
                    success: false,
                }) 
            }            
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: "Internal Server Error [DELETE CLASS].",
                error: true,
                success: false,
            })
        }
    }
}