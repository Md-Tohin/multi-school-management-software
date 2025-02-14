import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function TeacherDetails() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [teacher, setTeacher] = useState([]);
  const fetchTeacher = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/teacher/fetch-single`
      );
      console.log("Teacher Data: ", response);
      setTeacher(response.data.teacher);
    } catch (error) {
      console.log(error);
      setMessage("Select Role first. Then try again.");
      setMessageType("error");
      setHandleMessageOpen(true);
    }
  };
  useEffect(() => {
    fetchTeacher();
  }, []);

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
        <h2>Teacher Details</h2>
      </section>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#fff",
          width: "100%",
          padding: "2rem 2rem",
          borderRadius: "10px",
          border: "1px solid #d1d1d1",
        }}
      >
        <Box sx={{marginBottom: "0.5rem"}}>
          <img
            src={`/images/uploaded/teacher/${teacher.teacher_image}`}
            alt={teacher.name}
            style={{
              width: "150px",
              height: "150px",
              borderRadius: "50%",
            }}
          />
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Name:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.name}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Email:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.email}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Teacher ID:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.teacher_id}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Phone:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.phone}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Age:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.age} years
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Gender:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.gender}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Qualification:
                </TableCell>
                <TableCell component="th" scope="row">
                  {teacher.qualification}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
