import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid2";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import axios from "axios";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import { Link } from "react-router-dom";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function AttendanceStudentList() {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedlass] = useState(null);
  const [openChangeAttendee, setOpenChangeAttendee] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [attendee, setAttendee] = useState([]);

  const fetchClassDetails = async (classId) => {
    if (classId) {
      await axios
        .get(`${import.meta.env.VITE_API_URL}/api/class/single/${classId}`)
        .then((resp) => {
          if (resp.data.success) {
            setAttendee(resp.data?.data?.attendee);
          }
        })
        .catch((e) => {
          console.log(e);
          setMessage(e?.response?.data?.message);
          setMessageType("error");
          setHandleMessageOpen(true);
        });
    }
  };
  function fetchTeacher() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/teacher/fetch-with-query`, {
        params,
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
  }
  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
    setSelectedlass(e.target.value);
    fetchTeacher();
    cancelChangeClassAttendee(false);
    fetchClassDetails(e.target.value);
  };
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };
  const handleStudentId = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_id: e.target.value || undefined,
    }));
  };
  function fetchStudent() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/student/fetch-with-query`, {
        params,
      })
      .then((resp) => {
        if (resp.data.success) {
          setStudents(resp.data.students);
          fetchAttendanceForStudents(resp.data.students);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
        setHandleMessageOpen(true);
      });
  }
  async function fetchClass() {
    try {
      const response = await Axios({
        ...SummaryApi.getClass,
      });

      if (response.data.success) {
        setClasses(response.data.data);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchClass();
  }, []);

  useEffect(() => {
    fetchStudent();
  }, [params]);

  const [attendanceData, setAttendanceData] = useState({});

  const fetchAttendanceForStudents = async (studentList) => {
    const attendancePromises = studentList.map((student) =>
      fetchAttendanceForStudent(student._id)
    );
    const results = await Promise.all(attendancePromises);
    const updateAttendanceData = {};
    results.forEach(({ studentId, attendancePercentage }) => {
      updateAttendanceData[studentId] = attendancePercentage;
    });
    setAttendanceData(updateAttendanceData);
  };
  const fetchAttendanceForStudent = async (studentId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/fetch/${studentId}`
      );
      const attendanceRecords = response.data.attendance;
      const totalClasses = attendanceRecords.length;
      const presentCount = attendanceRecords.filter(
        (record) => record.status === "Present"
      ).length;
      const attendancePercentage =
        totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0;
      return { studentId, attendancePercentage };
    } catch (error) {
      console.log(
        `Error fetching attendange for student ${studentId} : `,
        error
      );
      return { studentId, attendancePercentage: 0 };
    }
  };
  const changeClassAttendee = async () => {
    try {
      if (!selectedTeacher) {
        setMessage("Please select any teacher");
        setMessageType("error");
        setHandleMessageOpen(true);
        return;
      }
      axios
        .patch(
          `${import.meta.env.VITE_API_URL}/api/class/update/${selectedClass}`,
          { attendee: selectedTeacher }
        )
        .then((resp) => {
          if (resp.data.success) {
            setSelectedTeacher(resp.data?.data?.attendee);
            fetchClassDetails(resp.data?.data?._id);
            setOpenChangeAttendee(false);
            setMessage(resp.data.message);
            setMessageType("success");
            setHandleMessageOpen(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setMessage(e?.response?.data?.message);
          setMessageType("error");
          setHandleMessageOpen(true);
        });
    } catch (e) {
      console.log(e);
      setMessage(e?.response?.data?.message);
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  };
  const cancelChangeClassAttendee = () => {
    setSelectedTeacher(selectedClass);
    setOpenChangeAttendee(false);
  };
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
        <h2>Attendance</h2>        
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6, md: 4 }}>
            <Item sx={{ padding: "1.5rem 1rem" }}>
              <Box>
                <FormControl style={{ width: "250px" }}>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    label="Select Class"
                    value={params.student_class ? params.student_class : ""}
                    onChange={(e) => {
                      handleClass(e);
                    }}
                    style={{ background: "white" }}
                  >
                    <MenuItem value=""> Select Class </MenuItem>
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
              <Box
                component={"div"}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                  paddingBottom: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <Box>
                  <TextField
                    label="Student ID"
                    value={params.student_id ? params.student_id : ""}
                    onChange={(e) => {
                      handleStudentId(e);
                    }}
                    style={{ background: "white" }}
                  />
                </Box>
                <Box>
                  <TextField
                    label="Student Name"
                    value={params.search ? params.search : ""}
                    onChange={(e) => {
                      handleSearch(e);
                    }}
                    style={{ background: "white" }}
                  />
                </Box>
              </Box>
              {openChangeAttendee && (
                <Box>
                  <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
                    Select Attendee
                  </Typography>
                  <Box sx={{ padding: "0.5rem 0" }}>
                    <FormControl style={{ width: "250px" }}>
                      <InputLabel>Select Teacher</InputLabel>
                      <Select
                        label="Select Teacher"
                        value={selectedTeacher}
                        onChange={(e) => {
                          setSelectedTeacher(e.target.value);
                        }}
                        style={{ background: "white" }}
                      >
                        <MenuItem value=""> Select Teacher </MenuItem>
                        {teachers &&
                          teachers.length > 0 &&
                          teachers.map((item, index) => {
                            return (
                              <MenuItem
                                key={item._id + "teacher" + index}
                                value={item._id}
                              >
                                {item.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <Button onClick={changeClassAttendee} variant="contained">
                      {attendee?._id ? "Update" : "Submit"}
                    </Button>
                    <Button
                      onClick={cancelChangeClassAttendee}
                      variant="contained"
                      sx={{ background: "tomato", marginLeft: "0.5rem" }}
                    >
                      Cancel
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      paddingBottom: "1rem",
                      paddingTop: "1rem",
                      marginX: "1rem",
                    }}
                  >
                    <hr />
                  </Box>
                </Box>
              )}
              {selectedClass && (
                <Box>
                  <Typography sx={{ fontSize: "24px", fontWeight: "600" }}>
                    Attendance
                  </Typography>
                  <Box
                    sx={{
                      borderBottom: "1px solid #999",
                      margin: "0.5rem 1.5rem",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontWeight: "500" }}>
                      Attendee Teacher
                    </Typography>
                    <Typography>{attendee?.name}</Typography>
                  </Box>
                  <Box sx={{ padding: "0.5rem 0" }}>
                    <Button
                      onClick={() => {
                        setSelectedTeacher(attendee?._id);
                        setOpenChangeAttendee(true);
                      }}
                      variant="outlined"
                    >
                      CHANGE ATTTENDEE
                    </Button>
                  </Box>
                </Box>
              )}
            </Item>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item sx={{ padding: "1rem 1rem" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Gender
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Guardian Phone
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Class
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Percentage
                      </TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Action
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students &&
                      students.map((student) => (
                        <TableRow
                          key={student._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {student.name}
                          </TableCell>
                          <TableCell align="right">{student.gender}</TableCell>
                          <TableCell align="right">
                            {student.guardian_phone}
                          </TableCell>
                          <TableCell align="right">
                            {student.student_class?.class_text}
                          </TableCell>
                          <TableCell align="right">
                            {attendanceData[student._id] !== undefined
                              ? `${attendanceData[student._id].toFixed(2)}%`
                              : "No Data"}
                          </TableCell>
                          <TableCell align="right"><Link to={`/school/attendance/${student._id}`}>Details</Link></TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
