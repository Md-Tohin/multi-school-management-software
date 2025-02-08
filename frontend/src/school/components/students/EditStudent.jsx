// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Button,
  CardMedia,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { studentEditSchema, studentSchema } from "../../../yupSchema/studentSchema";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

export default function EditStudent({
  classes,
  selectedStudent,
  openEditModal,
  setOpenEditModal,
  fetchStudent,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  const [open, setOpen] = useState(openEditModal);
  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false);
  };

  const initialValues = {
    name: selectedStudent.name,
    email: selectedStudent.email,
    student_class: selectedStudent.student_class._id,
    age: selectedStudent.age,
    gender: selectedStudent.gender,
    guardian: selectedStudent.guardian,
    guardian_phone: selectedStudent.guardian_phone,
    address: selectedStudent.address,
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: studentEditSchema,
    onSubmit: async (values) => {  
      const fd = new FormData();
      if (file) {        
        fd.append("image", file, file.name);
      } 
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("student_class", values.student_class);
      fd.append("age", values.age);
      fd.append("gender", values.gender);
      fd.append("guardian", values.guardian);
      fd.append("guardian_phone", values.guardian_phone);
      fd.append("address", values.address);
      fd.append("password", values.password);

      axios.patch(`${import.meta.env.VITE_API_URL}/api/student/update/${selectedStudent._id}`, fd)
      .then(resp => {
        Formik.resetForm();
          if(setOpenEditModal) setOpenEditModal(false);
          if(fetchStudent) fetchStudent();
          if(setMessage) setMessage(resp.data.message);
          if(setMessageType) setMessageType("success");
          if(setHandleMessageOpen) setHandleMessageOpen(true);
      })
      .catch((error) => {
        console.log(error);
        if(setMessage) setMessage(error?.response?.data?.message);
        if(setMessageType) setMessageType("error");
        if(setHandleMessageOpen) setHandleMessageOpen(true);
      })
    },
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    pl: 4,
    pr: 4,
    py: 4,
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(`/images/uploaded/student/${selectedStudent.student_image}`);
  //  PREVIEW IMAGE
  const addImage = (event) => {
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
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEditModal}>
          <Box sx={style}>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontWeight: "600" }}
            >
              Edit Student
            </Typography>
            <Box
              onSubmit={Formik.handleSubmit}
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                margin: "0 auto",
                gap: 3,
                maxHeight: "60vh",
                overflow: "auto",
                paddingTop: "1.5rem",
              }}
              noValidate
              autoComplete="off"
            >
              <Box>
                <TextField
                  name="name"
                  label="Student Name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.name && Formik.errors.name && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.name}
                  </p>
                )}
              </Box>
              <Box>
                <TextField
                  name="email"
                  label="Email"
                  value={Formik.values.email}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
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
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="student_class">Select Class</InputLabel>
                  <Select
                    labelId="student_class"
                    id="demo-simple-select"
                    value={Formik.values.student_class}
                    label="Select Class"
                    name="student_class"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    {classes &&
                      // eslint-disable-next-line react/prop-types
                      classes.length > 0 &&
                      // eslint-disable-next-line react/prop-types
                      classes.map((item, index) => {
                        return (
                          <MenuItem
                            key={item._id + "class" + index}
                            value={item._id}
                          >
                            {item.class_text} ({item.class_num})
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {Formik.touched.student_class &&
                  Formik.errors.student_class && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {Formik.errors.student_class}
                    </p>
                  )}
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Gender</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Formik.values.gender}
                    label="Gender"
                    name="gender"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    <MenuItem value={"male"}>Male</MenuItem>
                    <MenuItem value={"female"}>Female</MenuItem>
                    <MenuItem value={"other"}>Other</MenuItem>
                  </Select>
                </FormControl>
                {Formik.touched.gender && Formik.errors.gender && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.gender}
                  </p>
                )}
              </Box>
              <Box>
                <TextField
                  name="age"
                  label="Age"
                  value={Formik.values.age}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.age && Formik.errors.age && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.age}
                  </p>
                )}
              </Box>
              <Box>
                <TextField
                  name="guardian"
                  label="Guardian"
                  value={Formik.values.guardian}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.guardian && Formik.errors.guardian && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.guardian}
                  </p>
                )}
              </Box>
              <Box>
                <TextField
                  name="guardian_phone"
                  label="Guardian phone"
                  value={Formik.values.guardian_phone}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.guardian_phone &&
                  Formik.errors.guardian_phone && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {Formik.errors.guardian_phone}
                    </p>
                  )}
              </Box>
              <Box>
                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  value={Formik.values.password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
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
              </Box>
              <Box>
                <TextField
                  type="password"
                  name="confirm_password"
                  label="Confirm Password"
                  value={Formik.values.confirm_password}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.confirm_password &&
                  Formik.errors.confirm_password && (
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
              </Box>

              <Box>
                <Button
                  style={{ width: "100%", height: "55px" }}
                  component="label"
                  role={undefined}
                  variant="contained"
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Photo
                  <VisuallyHiddenInput
                    type="file"
                    inputRef={fineInputRef}
                    onChange={(event) => {
                      addImage(event);
                    }}
                  />
                </Button>
              </Box>
              <Box style={{ width: "100%" }}>
                <textarea
                  name="address"
                  style={{
                    borderRadius: "4px",
                    fontSize: "16px",
                    width: "100%",
                    padding: "10px",
                    fontFamily: "sans-serif",
                  }}
                  placeholder="Address"
                  rows={5}
                  defaultValue={Formik.values.address}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                >
                  {/* {Formik.values.address} */}
                </textarea>
                {Formik.touched.address && Formik.errors.address && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.address}
                  </p>
                )}
              </Box>
              <Box>
                {imageUrl && (
                  <Box style={{ width: "130px" }}>
                    <CardMedia
                      component={"img"}
                      height={"110px"}
                      image={imageUrl}
                      style={{ borderRadius: "5px" }}
                    />
                  </Box>
                )}
              </Box>
              <Box
                style={{
                  gridColumn: "span 2",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "30%",
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
