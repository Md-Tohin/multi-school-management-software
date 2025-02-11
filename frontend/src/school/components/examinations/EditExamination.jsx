import {
  Backdrop,
  Box,
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
import axios from "axios";
import { Formik, useFormik } from "formik";
import { useState } from "react";
import { useEffect } from "react";
import { periodSchema } from "../../../yupSchema/periodSchema";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ConfirmBox from "../../../basicUtilityComponents/ConfirmBox";
import { examinationSchema } from "../../../yupSchema/examinationSchema";

export default function EditExamination({
  openEditModal,
  setOpenEditModal,
  fetchExamination,
  selectedClass,
  editId,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
  selectedExamination,
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

  const [open, setOpen] = useState(openEditModal);
  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false);
  };

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

  const initialValues = {
    examDate: new Date(selectedExamination?.examDate),
    subject: selectedExamination?.subject?._id,
    examType: selectedExamination?.examType,
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: examinationSchema,
    onSubmit: async (values) => {
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/examination/update/${editId}`,
          {
            ...values,
            selectedClass,
          }
        )
        .then((resp) => {
          Formik.resetForm();
          if (setOpenEditModal) setOpenEditModal(false);
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
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Edit Examination
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
                        Formik.values.examDate
                          ? dayjs(Formik.values.examDate)
                          : null
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
                sx={{
                  marginTop: "1rem",
                  width: "100%",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "100%",
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
