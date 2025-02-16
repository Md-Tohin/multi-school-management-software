import { useEffect, useState } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import {
  Box,
  FormControl,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import axios from "axios";

export default function ExaminationsTeacher() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);

  async function fetchClass() {
    try {
      const response = await Axios({
        ...SummaryApi.getClass,
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

  async function fetchExamination() {
    if (selectedClass) {
      await axios
        .get(
          `${
            import.meta.env.VITE_API_URL
          }/api/examination/fetch-with-class/${selectedClass}`
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
        <h2>Examinations</h2>        
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      <Box style={{ width: "250px", marginBottom: "1.5rem" }}>
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
