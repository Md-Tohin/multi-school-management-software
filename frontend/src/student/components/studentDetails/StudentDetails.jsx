
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function StudentDetails() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const [student, setStudent] = useState([]);
  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/fetch-single`
      );
      setStudent(response.data.student);
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
        <h2>Student Details</h2>
      </section>
      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          background: "#fff",
          width: "80%",
          padding: "2rem 2rem",
          borderRadius: "10px",
          border: "1px solid #d1d1d1",
        }}
      >
        <Box sx={{marginBottom: "0.5rem"}}>
          <img
            src={`/images/uploaded/student/${student.student_image}`}
            alt={student.name}
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
                  {student.name}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Email:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.email}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Student ID:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.student_id}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Class:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student?.student_class?.class_text} ({student?.student_class?.class_num})
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Age:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.age} years
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Gender:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.gender}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                Guardian Name:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.guardian}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                Guardian Phone:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.guardian_phone}
                </TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Address:
                </TableCell>
                <TableCell component="th" scope="row">
                  {student.address}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}

