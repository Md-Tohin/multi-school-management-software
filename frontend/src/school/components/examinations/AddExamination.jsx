// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Button,
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
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import { periodSchema } from "../../../yupSchema/periodSchema";

import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import { examinationSchema } from "../../../yupSchema/examinationSchema";

export default function AddExamination({
  openAddModal,
  setOpenAddModal,
  fetchExamination,
  selectedClass,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  const [subjects, setSubjects] = useState([]);

  async function fetchData() {   
    await axios
      .get(`${import.meta.env.VITE_API_URL}/api/subject/all`)
      .then((resp) => {
        if (resp.data.success) {
          setSubjects(resp.data.allSubjects);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
        setHandleMessageOpen(true);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [open, setOpen] = useState(openAddModal);
  const handleClose = () => {
    setOpen(false);
    setOpenAddModal(false);
  };

  const initialValues = {
    examDate: new Date(),
    subject: "",
    examType: "",
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (values) => {
      console.log("Submited Value ",values);      
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/examination/create`, {
          ...values,
          selectedClass,
        })
        .then((resp) => {
          Formik.resetForm();
          if (setOpenAddModal) setOpenAddModal(false);
          if (fetchExamination) fetchExamination();
          if (setMessage) setMessage(resp.data.message);
          if (setMessageType) setMessageType("success");
          if (setHandleMessageOpen) setHandleMessageOpen(true);
        })
        .catch((error) => {
          console.log(error);
          if (setMessage) setMessage(error?.response?.data?.message);
          if (setMessageType) setMessageType("error");
          if (setHandleMessageOpen) setHandleMessageOpen(true);
        });
    },
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    boxShadow: 24,
    pl: 4,
    pr: 4,
    py: 4,
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAddModal}>
          <Box sx={style}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Add New Exam
            </Typography>
            <Box
              onSubmit={Formik.handleSubmit}
              component="form"
              sx={{
                maxHeight: "80vh",
                overflow: "auto",
                paddingTop: "1.5rem",
              }}
              noValidate
              autoComplete="off"
            >
              <Box sx={{ marginBottom: "1rem" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Date"
                      value={
                        Formik.values.examDate ? dayjs(Formik.values.examDate) : null
                      }
                      onChange={(newValue) => {
                        Formik.setFieldValue("examDate", newValue);
                      }}
               
                      sx={{ width: "100%" }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {Formik.touched.examDate && Formik.errors.examDate && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.examDate}
                  </p>
                )}
              </Box>
              <Box sx={{ marginBottom: "1rem" }}>
                <FormControl fullWidth>
                  <InputLabel id="subject">Select Subject</InputLabel>
                  <Select
                    labelId="subject"
                    id="subject"
                    value={Formik.values.subject}
                    label="Select Subject"
                    name="subject"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    {subjects &&
                      subjects.length > 0 &&
                      subjects.map((item, index) => {
                        return (
                          <MenuItem
                            key={item._id + "subject" + index}
                            value={item._id}
                          >
                            {item.subject_name} ({item.subject_codename})
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {Formik.touched.subject && Formik.errors.subject && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.subject}
                  </p>
                )}
              </Box>

              <Box>
                <TextField
                  name="examType"
                  label="Exam Type"
                  value={Formik.values.examType}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.examType && Formik.errors.examType && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.examType}
                  </p>
                )}
              </Box>

              <Box
                style={{
                    marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
