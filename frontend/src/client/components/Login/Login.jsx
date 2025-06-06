import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { Button, Typography } from "@mui/material";
// import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import image from "../../../../public/images/register.webp";
import { loginSchema } from "../../../yupSchema/loginSchema";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);
  const [handleMessageOpen, setHandleMessageOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [messageType, setMessageType] = React.useState("success");
  const [selectedRole, setSelectedRole] = React.useState("");

  const initialValues = {
    email: "",
    password: "",
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      // try {
        if (!selectedRole) {
          setMessage("Select Role first. Then try again.");
          setMessageType("error");
          setHandleMessageOpen(true);
          return
        }
        let url;
        if(selectedRole === "student") {
          url = `${import.meta.env.VITE_API_URL}/api/student/login`
        }
        else if(selectedRole === "teacher") {
          url = `${import.meta.env.VITE_API_URL}/api/teacher/login`
        }
        else if(selectedRole === "school") {
          url = `${import.meta.env.VITE_API_URL}/api/school/login`
        }
        axios.post(url, {...values})
        .then(response => {
          const { data: resp } = response;
          const token = response.headers.get("Authorization");
          if (token) {
            localStorage.setItem("token", token);
          }
          const user = resp?.user;
          if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            login(user);
          }
          Formik.resetForm();
          setMessage(resp?.message);
          setMessageType("success");
          setHandleMessageOpen(true);
          navigate(`/${selectedRole}`);
        })
        .catch(error => {
          console.log(error);          
          setMessage(error?.response?.data?.message);
          setMessageType("error");
          setHandleMessageOpen(true);
        })

        // const response = await Axios({
        //   ...SummaryApi.login,
        //   data: { ...values },
        // });
        // const { data: resp } = response;
        // const token = await response.headers.get("Authorization");
        // if (token) {
        //   localStorage.setItem("token", token);
        // }
        // const user = await resp?.user;
        // if (user) {
        //   localStorage.setItem("user", JSON.stringify(user));
        //   login(user);
        // }
        // Formik.resetForm();
        // setMessage(resp?.message);
        // setMessageType("success");
        // setHandleMessageOpen(true);
        // navigate(`/${selectedRole}`);
      // } catch (e) {
      //   setMessage(e?.response?.data?.message);
      //   setMessageType("error");
      //   setHandleMessageOpen(true);
      // }

      //   axios
      //     .post(`${import.meta.env.VITE_API_URL}api/school/login`, { ...values })
      //     .then((resp) => {
      //         const token = resp.headers.get("Authorization");
      //         console.log(token);

      //         if(token){
      //             localStorage.setItem("token", token);
      //         }
      //         const user = resp?.data?.user;
      //         if(user){
      //             localStorage.setItem("user", JSON.stringify(user));
      //         }
      //       Formik.resetForm();
      //       setMessage(resp?.data?.message);
      //       setMessageType("success");
      //       setHandleMessageOpen(true);
      //     })
      //     .catch((e) => {
      //       setMessage(e?.response?.data?.message);
      //       setMessageType("error");
      //       setHandleMessageOpen(true);
      //     });
    },
  });

  return (
    <Box
      component={"div"}
      sx={{
        backgroundImage: `url(${image})`,
        padding: "3rem 0",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        minHeight: "80vh",
      }}
    >
      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      <Box
        onSubmit={Formik.handleSubmit}
        component="form"
        sx={{
          "& > :not(style)": { m: 0.3 },
          display: "flex",
          flexDirection: "column",
          width: "50vw",
          minWidth: "230px",
          margin: "auto",
          background: "white",
          padding: "2rem 2rem",
          borderRadius: "15px",
        }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h4" sx={{ textAlign: "center", color: "#1976d2" }}>
          Login
        </Typography>

        <TextField
          name="email"
          label="Email"
          value={Formik.values.email}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          style={{ marginTop: "15px" }}
        />
        {Formik.touched.email && Formik.errors.email && (
          <p
            style={{
              color: "red",
              textTransform: "",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {Formik.errors.email}
          </p>
        )}

        <TextField
          type="password"
          name="password"
          label="Password"
          value={Formik.values.password}
          onChange={Formik.handleChange}
          onBlur={Formik.handleBlur}
          style={{ marginTop: "15px" }}
        />
        {Formik.touched.password && Formik.errors.password && (
          <p
            style={{
              color: "red",
              textTransform: "",
              fontWeight: "600",
              fontSize: "14px",
            }}
          >
            {Formik.errors.password}
          </p>
        )}

        <Box sx={{ display: "flex", gap: 1.5, marginBottom: "1rem", paddingTop: "1rem" }}>
          <Button
            variant={`${selectedRole === "student" ? "contained" : "outlined"}`}
            onClick={() => setSelectedRole("student")}
          >
           Student
          </Button>          
          <Button
            variant={`${selectedRole === "teacher" ? "contained" : "outlined"}`}
            onClick={() => setSelectedRole("teacher")}
          >
            Teacher
          </Button>
          <Button            
            variant={`${selectedRole === "school" ? "contained" : "outlined"}`}
            onClick={() => setSelectedRole("school")}
          >
            School
          </Button>
        </Box>

        <Button type="submit" variant="contained" style={{ marginTop: "15px" }}>
          Login
        </Button>
      </Box>
    </Box>
  );
}
