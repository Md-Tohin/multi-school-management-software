import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import axios from "axios";
import { PieChart } from "@mui/x-charts/PieChart";

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

export default function AttendanceStudent() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  const [student, setStudent] = useState([]);
  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/fetch-single`
      );
      setStudent(response.data?.student);
    } catch (error) {
      console.log(error);
      setMessage("Select Role first. Then try again.");
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  };
  useEffect(() => {
    fetchStudent();
  }, []);

  const studentId = student?._id;

  const [attendanceData, setAttendanceData] = useState([]);

  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + `-` + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/fetch/${studentId}`
      );
      setAttendanceData(response.data?.attendance);
      const respData = response.data?.attendance;
      if (respData.length > 0) {
        respData.forEach((attendance) => {
          if (attendance.status === "present") {
            setPresent((prev) => prev + 1);
          } else if (attendance.status === "absent") {
            setAbsent((prev) => prev + 1);
          }
        });
      }
    } catch (e) {
      console.log(e);
      setMessage(e?.response?.data?.message);
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchAttendanceData();
    }
  }, [studentId]);
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
        <h2>Attendance Details</h2>
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
              <PieChart
                colors={["#4dff88", "#ff6666"]}
                series={[
                  {
                    data: [
                      { id: 0, value: present, label: "Present" },
                      { id: 1, value: absent, label: "Absent" },
                    ],
                  },
                ]}
                width={400}
                height={200}
              />
            </Item>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item sx={{ padding: "1rem 1rem" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceData &&
                      attendanceData.map((attendance) => (
                        <TableRow
                          key={attendance?._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {dateFormat(attendance?.date)}
                          </TableCell>

                          <TableCell align="right">
                            <p
                              style={{
                                border: `1px solid ${
                                  attendance?.status === "present"
                                    ? "rgba(7, 241, 50, 0.7)"
                                    : "rgba(252, 78, 78, 0.7)"
                                }`,
                                color:
                                  attendance?.status === "present"
                                    ? "hsla(130, 91.30%, 13.50%, 0.70)"
                                    : "rgba(85, 3, 3, 0.7)",
                                display: "inline",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                background:
                                  attendance?.status === "present"
                                    ? "rgba(165, 250, 180, 0.7)"
                                    : "rgba(250, 165, 165, 0.7)",
                              }}
                            >
                              {attendance?.status}
                            </p>
                          </TableCell>
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
