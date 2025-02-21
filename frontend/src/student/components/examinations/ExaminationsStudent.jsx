import { useEffect, useState } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

export default function ExaminationsStudent() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/student/fetch-single`
      );
      setSelectedClass(response.data?.student?.student_class);
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

  async function fetchExamination() {
    if (selectedClass) {
      await axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/examination/fetch-with-class/${selectedClass._id}`
        )
        .then((resp) => {
          if (resp.data.success) {
            setExaminations(resp.data?.examinations);
          }
        })
        .catch((e) => {
          console.log(e);
          setMessage(e?.response?.data?.message);
          setMessageType("error");
          setHandleMessageOpen(true);
        });
    }
  }

  useEffect(() => {
    fetchExamination();
  }, [selectedClass]);

 
  const dateFormat = (dateData) => {
    const date = new Date(dateData);
    return (
      date.getDate() + `-` + (+date.getMonth() + 1) + "-" + date.getFullYear()
    );
    // const dateHours = date.getHours();
    // const dateMinutes = date.getMinutes();
    // return `${dateHours}:${dateMinutes < 10 ? '0' : ''}${dateMinutes}`
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
        <h2>Examinations For Class {selectedClass?.class_text} ({selectedClass?.class_num})</h2>        
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      <Box component={"div"}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "600" }}>Exam Date</TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="right">
                  Subject
                </TableCell>
                <TableCell sx={{ fontWeight: "600" }} align="right">
                  Exam Type
                </TableCell>                
              </TableRow>
            </TableHead>
            <TableBody>
              {examinations &&
                examinations.map((examination, index) => (
                  <TableRow
                    key={examination._id + "exam" + index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      {dateFormat(examination.examDate)}
                    </TableCell>
                    <TableCell align="right">
                      {examination?.subject?.subject_name} (
                      {examination?.subject?.subject_codename})
                    </TableCell>
                    <TableCell align="right">{examination.examType}</TableCell>                   
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
}
