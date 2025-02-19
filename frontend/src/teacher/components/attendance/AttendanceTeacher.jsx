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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function AttendanceTeacher() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [students, setStudents] = useState([]);

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

  function fetchStudent() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/student/fetch-with-query`, {
        params: { student_class: selectedClass },
      })
      .then((resp) => {
        if (resp.data.success) {
          console.log("Students : ", resp.data.students);
          setStudents(resp.data.students);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
      });
  }
  useEffect(() => {
    fetchStudent();
  }, [selectedClass]);

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

      {classes && classes.length > 0 && (
        <Box
          style={{ width: "250px", marginBottom: "1.5rem", marginTop: "1rem" }}
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
                    <MenuItem key={item._id + "class" + index} value={item._id}>
                      {item.class_text} ({item.class_num})
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
      )}

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
                        key={student._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Checkbox {...label} />
                        </TableCell>
                        <TableCell align="center">
                          {student.student_id}
                        </TableCell>
                        <TableCell align="center">{student.name}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
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
                marginTop: "1.5rem",
                width: "20%",
              }}
            >
              Submit
            </Button>
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
