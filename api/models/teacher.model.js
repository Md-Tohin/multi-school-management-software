const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    school: {
        type: mongoose.Schema.ObjectId,
        ref: 'School'
    },
    teacher_id: {
        type: String,
        default: "",
      },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    teacher_image: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
      },
    password: {
        type: String,
        required: true
    }
},{
    timestamps: true 
})

module.exports = mongoose.model("Teacher", teacherSchema)