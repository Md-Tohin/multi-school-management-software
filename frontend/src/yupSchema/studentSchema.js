import * as yup from 'yup';

export const studentSchema = yup.object({
    name: yup.string().min(3, "Student name must contain 3 charcters.").required("Student name field is required"),
    email: yup.string().email("It must be an Email").required("Email field is required"),
    student_class: yup.string().required("Class field is required"),
    address: yup.string().required("Address field is required"),
    age: yup.number().required("Age field is required"),
    gender: yup.string().required("Gender field is required"),
    guardian: yup.string().min(3, "Must contain 3 characters").required("Guardian field is required"),
    guardian_phone: yup.string().min(11, "Must contain 11 characters").required("Guardian phone field is required"),
    password: yup.string().min(6, "Password must contain 6 character").required("Password field is required"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm password does not match.").required("Confirm password field is required")
})