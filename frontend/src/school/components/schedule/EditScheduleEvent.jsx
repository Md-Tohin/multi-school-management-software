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

export default function EditScheduleEvent({
  openEditModal,
  setOpenEditModal,
  fetchSchedule,
  selectedClass,
  editId,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);

  async function fetchData() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/teacher/fetch-with-query`, {
        params: {},
      })
      .then((resp) => {
        if (resp.data.success) {
          setTeachers(resp.data.teachers);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
        setHandleMessageOpen(true);
      });

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

  const periods = [
    {
      id: 1,
      label: "Period 1 (10:00 AM - 11:00 AM)",
      startTime: "10:00",
      endTime: "11:00",
    },
    {
      id: 2,
      label: "Period 2 (11:00 AM - 12:00 PM)",
      startTime: "11:00",
      endTime: "12:00",
    },
    {
      id: 3,
      label: "Period 3 (12:00 PM - 01:00 PM)",
      startTime: "12:00",
      endTime: "13:00",
    },
    {
      id: 4,
      label: "Lunch Break (01:00 PM - 02:00 PM)",
      startTime: "13:00",
      endTime: "14:00",
    },
    {
      id: 5,
      label: "Period 5 (02:00 PM - 03:00 PM)",
      startTime: "14:00",
      endTime: "15:00",
    },
    {
      id: 6,
      label: "Period 6 (03:00 PM - 04:00 PM)",
      startTime: "15:00",
      endTime: "16:00",
    },
  ];

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
    teacher: "",
    subject: "",
    period: "",
    date: new Date(),
  };

  const dateFormat = (date) => {
    const dateHours = date.getHours();
    const dateMinutes = date.getMinutes();
    return `${dateHours}:${dateMinutes < 10 ? "0" : ""}${dateMinutes}`;
  };

  useEffect(() => {
    if (editId) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/schedule/fetch/${editId}`)
        .then((resp) => {
          if (resp.data.success) {
            let start = new Date(resp?.data?.schedule[0]?.startTime);
            let end = new Date(resp?.data?.schedule[0]?.endTime);
            let finalFormatedTime = dateFormat(start) + "," + dateFormat(end);
            Formik.setFieldValue(
              "teacher",
              resp?.data?.schedule[0]?.teacher?._id
            );
            Formik.setFieldValue(
              "subject",
              resp?.data?.schedule[0]?.subject?._id
            );
            Formik.setFieldValue("period", `${finalFormatedTime}`);
            Formik.setFieldValue("date", start);
          }
        })
        .catch((e) => {
          console.log(e);
          setMessage(e?.response?.data?.message);
          setMessageType("error");
          setHandleMessageOpen(true);
        });
    }
  }, [editId]);

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: async (values) => {
      let date = new Date(values.date);
      let startTime = values.period.split(",")[0];
      let endTime = values.period.split(",")[1];      
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/schedule/update/${editId}`,
          {
            ...values,
            selectedClass,
            startTime: new Date(
              date.setHours(startTime.split(":")[0], startTime.split(":")[1])
            ),
            endTime: new Date(
              date.setHours(endTime.split(":")[0], endTime.split(":")[1])
            ),
          }
        )
        .then((resp) => {
          Formik.resetForm();
          if (setOpenEditModal) setOpenEditModal(false);
          if (fetchSchedule) fetchSchedule();
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

  const openComfirmDelete = () => {
    setOpenConfirmBox(true)
  }
  const handleDelete = () => { 
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/schedule/delete/${editId}`)
      .then((resp) => {        
        setOpenConfirmBox(false) 
        Formik.resetForm();
        if (setOpenEditModal) setOpenEditModal(false);
        if (fetchSchedule) fetchSchedule();
    
        if (setMessage) setMessage(resp.data.message);
        if (setMessageType) setMessageType("success");
        if (setHandleMessageOpen) setHandleMessageOpen(true);
      })
      .catch((e) => {
        console.log(e);
        if (setMessage) setMessage(e?.response?.data?.message);
        if (setMessageType) setMessageType("error");
        if (setHandleMessageOpen) setHandleMessageOpen(true);
        setOpenConfirmBox(false);
      });    
  }

  return (
    <div>
        {openConfirmBox && (
                <ConfirmBox
                  openConfirmBox={openConfirmBox}
                  setOpenConfirmBox={setOpenConfirmBox}
                  cancel={() => setOpenConfirmBox(false)}
                  confirm={handleDelete}
                />
              )}
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
              Edit Period
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
                <FormControl fullWidth>
                  <InputLabel id="teacher">Select Teacher</InputLabel>
                  <Select
                    labelId="teacher"
                    id="teacher"
                    value={Formik.values.teacher}
                    label="Select Teacher"
                    name="teacher"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    {teachers &&
                      teachers.length > 0 &&
                      teachers.map((item, index) => {
                        return (
                          <MenuItem
                            key={item._id + "teacher" + index}
                            value={item._id}
                          >
                            {item.name} ({item.teacher_id})
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {Formik.touched.teacher && Formik.errors.teacher && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.teacher}
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
              <Box sx={{ marginBottom: "1rem" }}>
                <FormControl fullWidth>
                  <InputLabel id="period">Select Period</InputLabel>
                  <Select
                    labelId="period"
                    id="period"
                    value={Formik.values.period}
                    label="Select Period"
                    name="period"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    {periods &&
                      periods.length > 0 &&
                      periods.map((item, index) => {
                        return (
                          <MenuItem
                            key={item._id + "period" + index}
                            value={`${item.startTime},${item.endTime}`}
                          >
                            {item.label}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
                {Formik.touched.period && Formik.errors.period && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.period}
                  </p>
                )}
              </Box>

              <Box sx={{ marginBottom: "1rem" }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                    <DatePicker
                      label="Date"
                      value={
                        Formik.values.date ? dayjs(Formik.values.date) : null
                      }
                      onChange={(newValue) => {
                        Formik.setFieldValue("date", newValue);
                      }}
                      sx={{ width: "100%" }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {Formik.touched.date && Formik.errors.date && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.date}
                  </p>
                )}
              </Box>

              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
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
                  <Button
                    onClick={openComfirmDelete}
                    type="button"
                    variant="contained"
                    sx={{
                      width: "100%",
                      background: "red",
                      marginTop: "1rem",
                    }}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
