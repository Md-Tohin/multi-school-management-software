import * as yup from "yup";

export const examinationSchema = yup.object({
    subject: yup.string().required("Subject name field is required"),
    examType: yup.string().min(2, "Atleast 2 characters are required").required("Exam Type field is required"),
    examDate: yup.string().required("Exam Date field is required"),
})