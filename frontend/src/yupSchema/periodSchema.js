import * as yup from "yup";

export const periodSchema = yup.object({
    teacher: yup.string().required("Teacher field is required"),
    subject: yup.string().required("Subject field is required"),
    period: yup.string().required("Period field is required"),
    date: yup.string().required("Date field is required"),
})