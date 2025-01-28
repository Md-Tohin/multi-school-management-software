import * as yup from "yup";

export const registerSchema = yup.object({
    school_name: yup.string().min(6, "School name must contain 8 charcters.").required("School name field is required"),
    email: yup.string().email("It must be an Email").required("Email field is required"),
    owner_name: yup.string().min(3, "Owner name nust have 3 characters").required("Owner name field is required"),
    password: yup.string().min(6, "Password must contain 6 character").required("Password field is required"),
    confirm_password: yup.string().oneOf([yup.ref('password')], "Confirm password does not match.").required("Confirm password field is required")
})
