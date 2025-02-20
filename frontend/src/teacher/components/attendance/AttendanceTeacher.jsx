import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import {
  Button,
  Checkbox,
  FormControl,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import Paper from "@mui/material/Paper";
import axios from "axios";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [students, setStudents] = useState([]);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [attendanceExists, setAttendanceExists] = useState(false);

  async function fetchClass() {
    try {
      const response = await Axios({
        ...SummaryApi.getAttendeeClass,
      });

      if (response.data.success) {
        setClasses(response.data.data);
        setSelectedClass(response?.data?.data[0]._id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchClass();
  }, []);

  const [attendanceStatus, setAttendanceStatus] = useState({});

  const handleAttendance = (studentId, status) => {
    setAttendanceStatus((prevStatus) => (
      {
        ...prevStatus,
          [studentId]: status,
      }
    ));
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const singleStudentStatus = async (studentId, status) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attendance/mark`,
        {
          studentId: studentId,
          classId: selectedClass,
          date: selectedDate,
          status,
        }
      );
    } catch (error) {
      console.log("Error in Marking Attendance.", error);
    }
  };

  const submitAttendance = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          attendanceExists ? singleStudentStatus(student?.student?._id, attendanceStatus[student?.student?._id]) : 
          singleStudentStatus(student._id, attendanceStatus[student._id])
        )
      );
      setMessage("Attendance Submitted Successfully!");
      setMessageType("success");
      setHandleMessageOpen(true);
    } catch (error) {
      console.log("Error in All Marking Attendance.", error);
      setMessage("Attendance Submitted Failed!");
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  }; 

  function checkExistsStudentAttendance() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/attendance/check-exists`, {
        params: { classId: selectedClass, date: selectedDate },
      })
      .then((resp) => {
        if (resp.data.attendance && resp.data.attendance.length > 0) {
          setAttendanceExists(true);
          setStudents(resp?.data?.attendance);
          const initialAttendance = {};
          resp.data?.attendance.forEach((student) => {
            initialAttendance[student.student._id] = student.status;
          });
          setAttendanceStatus(initialAttendance);
        } else {
          fetchStudent();
          setAttendanceExists(false);
        }
      })
      .catch((e) => {
        console.log("Error in [CHECK ATTENDANCE]", e);
      });
  }

  useEffect(() => {
    checkExistsStudentAttendance();
  }, [selectedClass, selectedDate]);

  function fetchStudent() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/student/fetch-with-query`, {
        params: { student_class: selectedClass },
      })
      .then((resp) => {
        if (resp.data.success) {
          setStudents(resp.data.students);
          // Initially set all students as absent
          resp.data.students.forEach((student) => {
            handleAttendance(student._id, "absent");
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
      });
  }
  // useEffect(() => {
  //   fetchStudent();
  // }, [selectedClass]);

  return (
    <div>
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "1rem",
        }}
      >
        <h2>Mark Attendance for All Students</h2>
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      {classes.length > 0 ? (
        <Box component="div">
          <Alert severity="info">
            You are attendee of {classes.length} class. Select the class and
            take attendance
          </Alert>
        </Box>
      ) : (
        <Alert severity="warning">You are not attendee of any classes.</Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "end", gap: 3 }}>
        {classes && classes.length > 0 && (
          <Box
            style={{
              width: "250px",
              marginBottom: "1.5rem",
              marginTop: "1rem",
            }}
          >
            <FormControl fullWidth>
              <Typography sx={{ fontWeight: "500" }}>Select Class</Typography>
              <Select
                value={selectedClass}
                name="student_class"
                onChange={(e) => {
                  setSelectedClass(e.target.value);
                }}
              >
                {classes &&
                  classes.length > 0 &&
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
          </Box>
        )}

        <Box sx={{ marginBottom: "1.5rem" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker"]}>
              <DatePicker
                label="Date"
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(newValue) => setSelectedDate(newValue)}
                sx={{ width: "100%" }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </Box>
      </Box>

      {students && students.length > 0 ? (
        <>
          <Box component={"div"} sx={{ width: "80%" }}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "600", width: "20%" }}>
                      Attendance Status
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "600", width: "30%" }}
                      align="center"
                    >
                      Student ID
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "600", width: "50%" }}
                      align="center"
                    >
                      Name
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students &&
                    students.map((student) => (
                      <TableRow
                        key={
                          attendanceExists ? student?.student?._id : student._id
                        }
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {
                            attendanceExists ? <Checkbox
                            {...label}
                            checked={
                              attendanceStatus[student?.student?._id] === "present"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              handleAttendance( 
                                student?.student?._id,
                                e.target.checked ? "present" : "absent"
                              );
                            }}
                          /> : <Checkbox
                            {...label}
                            checked={
                              attendanceStatus[student?._id] === "present"
                                ? true
                                : false
                            }
                            onChange={(e) => {
                              handleAttendance( 
                                student._id,
                                e.target.checked ? "present" : "absent"
                              );
                            }}
                          />
                          }
                          
                        </TableCell>
                        <TableCell align="center">
                          {attendanceExists
                            ? student?.student?.student_id
                            : student.student_id}
                        </TableCell>
                        <TableCell align="center">
                          {attendanceExists
                            ? student?.student?.name
                            : student.name}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                  marginTop: "1.5rem",
                  width: "20%",
                }}
                onClick={submitAttendance}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Alert severity="warning">Student Not Found in this class.</Alert>
        </>
      )}
    </div>
  );
}
