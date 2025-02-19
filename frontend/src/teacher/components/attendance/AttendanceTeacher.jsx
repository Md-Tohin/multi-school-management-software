import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import axios from "axios";

const columns = [
  // { field: "id", headerName: "attendance", width: 100 },
  { field: "student_id", headerName: "Student Id", width: 150 },
  { field: "name", headerName: "Student name", width: 350 },
];

const paginationModel = { page: 0, pageSize: 5 };

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

  const [rows, setRows] = useState([]);

  function fetchStudent() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/student/fetch-with-query`, {
        params: {student_class: selectedClass},
      })
      .then((resp) => {
        if (resp.data.success) {
          console.log("Students : ", resp.data.students);          
          setStudents(resp.data.students);
          let customRows = resp?.data?.students.map((student, index) => ({
            id: index,
            student_id: student.student_id,
            name: student.name
          }));
          setRows(customRows);          
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

      <Box component={"div"}>
        <Paper sx={{ height: 400, width: "90%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            sx={{ border: 0 }}
          />
        </Paper>
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
    </div>
  );
}
