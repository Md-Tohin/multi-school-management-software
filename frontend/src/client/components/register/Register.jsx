import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useFormik } from "formik";
import { Button, CardMedia, Typography } from "@mui/material";
import { registerSchema } from "../../../yupSchema/registerSchema";
import axios from "axios";

export default function Register() {  
  const [file, setFile] = React.useState(null);
  const [imageUrl, setImageUrl] = React.useState(null);
  //  PREVIEW IMAGE
  const addImage = (event) => {
    console.log(event);
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };
  //  RESET IMAGE
  const fineInputRef = React.useRef(null);
  const handleClearFile = () => {
    if (fineInputRef.current) {
        fineInputRef.current.value = "";
        setFile(null);
        setImageUrl(null);
    }
  }
  const initialValues = {
    school_name: "",
    email: "",
    owner_name: "",
    password: "",
    confirm_password: "",
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: registerSchema,
    onSubmit: (values) => {

      console.log("Register from input value: ", values);
      const fd = new FormData();

      fd.append("image", file, file.name);
      fd.append("school_name", values.school_name);
      fd.append("email", values.email);
      fd.append("owner_name", values.owner_name);
      fd.append("password", values.password);
      
      axios.post(`${import.meta.env.VITE_API_URL}api/school/register`, fd)
      .then(resp => {
        console.log(resp);
        Formik.resetForm();
        handleClearFile();
      })
      .catch(e => {
        console.log("Error: ", e);
      })
      
    },
  }); 

  return (
    <Box
      onSubmit={Formik.handleSubmit}
      component="form"
      sx={{
        "& > :not(style)": { m: 0.3 },
        display: "flex",
        flexDirection: "column",
        width: "60vw",
        minWidth: "230px",
        margin: "auto",
      }}
      noValidate
      autoComplete="off"
    >
      <Box>
        <Typography>Add School Picture</Typography>
        <TextField
          style={{ marginTop: "15px", width: "100%" }}
          type="file"
          inputRef={fineInputRef}
          onChange={(event) => {
            addImage(event);
          }}
        />
      </Box>

      {imageUrl && (
        <Box style={{marginTop: "10px"}}>
          <CardMedia component={"img"} height={"240px"} image={imageUrl} />
        </Box>
      )}

      <TextField
        name="school_name"
        label="School Name"
        value={Formik.values.school_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        style={{ marginTop: "15px" }}
      />
      {Formik.touched.school_name && Formik.errors.school_name && (
        <p
          style={{
            color: "red",
            textTransform: "",
            fontWeight: "600",
            fontSize: "14px",
            padding: "0px",
          }}
        >
          {Formik.errors.school_name}
        </p>
      )}
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
        name="owner_name"
        label="Owner name"
        value={Formik.values.owner_name}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        style={{ marginTop: "15px" }}
      />
      {Formik.touched.owner_name && Formik.errors.owner_name && (
        <p
          style={{
            color: "red",
            textTransform: "",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {Formik.errors.owner_name}
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

      <TextField
        type="password"
        name="confirm_password"
        label="Confirm Password"
        value={Formik.values.confirm_password}
        onChange={Formik.handleChange}
        onBlur={Formik.handleBlur}
        style={{ marginTop: "15px", marginBottom: "15px" }}
      />
      {Formik.touched.confirm_password && Formik.errors.confirm_password && (
        <p
          style={{
            color: "red",
            textTransform: "",
            fontWeight: "600",
            fontSize: "14px",
          }}
        >
          {Formik.errors.confirm_password}
        </p>
      )}
      <Button type="submit" variant="contained">
        Submit
      </Button>
    </Box>
  );
}
