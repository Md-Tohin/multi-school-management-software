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
import { teacherEditSchema } from "../../../yupSchema/teacherSchema";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

export default function EditTeacher({
  selectedTeacher,
  openEditModal,
  setOpenEditModal,
  fetchTeacher,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  console.log("edit data: ", selectedTeacher);

  const [open, setOpen] = useState(openEditModal);
  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false);
  };

  const initialValues = {
    name: selectedTeacher.name,
    email: selectedTeacher.email,
    age: selectedTeacher.age,
    gender: selectedTeacher.gender,
    salary: selectedTeacher.salary,
    qualification: selectedTeacher.qualification,
    phone: selectedTeacher.phone,
    address: selectedTeacher.address,
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: teacherEditSchema,
    onSubmit: async (values) => {  
      const fd = new FormData();
      if (file) {        
        fd.append("image", file, file.name);
      } 
      fd.append("name", values.name);
      fd.append("email", values.email);
      fd.append("age", values.age);
      fd.append("gender", values.gender);
      fd.append("salary", values.salary);
      fd.append("qualification", values.qualification);
      fd.append("phone", values.phone);
      fd.append("address", values.address);
      fd.append("password", values.password);

      axios.patch(`${import.meta.env.VITE_API_URL}/api/teacher/update/${selectedTeacher._id}`, fd)
      .then(resp => {
        Formik.resetForm();
          if(setOpenEditModal) setOpenEditModal(false);
          if(fetchTeacher) fetchTeacher();
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
  const [imageUrl, setImageUrl] = useState(`/images/uploaded/teacher/${selectedTeacher.teacher_image}`);
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
              Edit Teacher
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
                  label="Teacher Name"
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
                <TextField
                  name="phone"
                  label="Phone"
                  value={Formik.values.phone}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.phone &&
                  Formik.errors.phone && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {Formik.errors.phone}
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
                  name="qualification"
                  label="Qualification"
                  value={Formik.values.qualification}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.qualification && Formik.errors.qualification && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.qualification}
                  </p>
                )}
              </Box>
              <Box>
                <TextField
                  name="salary"
                  label="Salary"
                  value={Formik.values.salary}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.salary &&
                  Formik.errors.salary && (
                    <p
                      style={{
                        color: "red",
                        textTransform: "",
                        fontWeight: "600",
                        fontSize: "14px",
                      }}
                    >
                      {Formik.errors.salary}
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

