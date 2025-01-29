import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email("It must be an Email").required("Email field is required"),
    password: yup.string().min(6, "Password must contain 6 character").required("Password field is required"),
})