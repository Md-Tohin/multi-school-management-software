import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import axios from "axios";

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

export default function AttendanceDetails() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const studentId = useParams().id;
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/fetch/${studentId}`
      );
      console.log("Fetch Student Attendance Details: ",response);
      setAttendanceData(response.data?.attendance)
    } catch (e) {
      console.log(e);
      setMessage(e?.response?.data?.message);
      setMessageType("error");
      setHandleMessageOpen(true);
      navigate('/school/attendance');
    }
  };

  useEffect(() => {
    fetchAttendanceData()
  }, [])
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
              
            </Item>
          </Grid>
          <Grid size={{ xs: 6, md: 8 }}>
            <Item sx={{ padding: "1rem 1rem" }}>
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "600" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "600" }} align="right">Status</TableCell>
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
                            {attendance?.date}
                          </TableCell>
                          
                          <TableCell align="right">{attendance?.status}</TableCell>
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
