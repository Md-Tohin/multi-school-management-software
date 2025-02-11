import * as yup from "yup";

export const noticeSchema = yup.object({
    title: yup.string().required("Title field is required"),
    message: yup.string().min(2, "Atleast 2 characters are required").required("Message field is required"),
    audience: yup.string().required("Audience field is required"),
})