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
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import { periodSchema } from "../../../yupSchema/periodSchema";

import dayjs from 'dayjs';
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";

export default function AddScheduleEvent({
  openAddModal,
  setOpenAddModal,
  fetchSchedule,  
  selectedClass,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
    const [teachers, setTeachers] = useState([]);
    const [subjects, setSubjects] = useState([]);

    async function fetchData() {
        axios.get(`${import.meta.env.VITE_API_URL}/api/teacher/fetch-with-query`, {
          params:{}
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
    
        await axios.get(`${import.meta.env.VITE_API_URL}/api/subject/all`)
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

  const [open, setOpen] = useState(openAddModal);
  const handleClose = () => {
    setOpen(false);
    setOpenAddModal(false);
  };

  const initialValues = {
    teacher: "",
    subject: "",
    period: "",
    date: new Date(),
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: periodSchema,
    onSubmit: async (values) => {      
      let date = new Date(values.date);
      let startTime = values.period.split(",")[0];
      let endTime = values.period.split(",")[1];      
      axios.post(`${import.meta.env.VITE_API_URL}/api/schedule/create`, {
        ...values, 
        selectedClass,
        startTime: new Date(date.setHours(startTime.split(':')[0], startTime.split(":")[1])),
        endTime: new Date(date.setHours(endTime.split(':')[0], endTime.split(":")[1]))
    })
      .then(resp => {
        Formik.resetForm();
          if(setOpenAddModal) setOpenAddModal(false);
          if(fetchSchedule) fetchSchedule();
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
              Add New Period
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

              <Box sx={{ marginBottom: "1rem"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["DatePicker"]}>
                  <DatePicker
                    label="Date"
                    value={Formik.values.date ? dayjs(Formik.values.date) : null}
                    onChange={(newValue) => {
                        Formik.setFieldValue("date", newValue)
                    }}
                    sx={{width: "100%"}}
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
