import { useEffect, useState } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import {
  Box,
  Button,
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
import EditExamination from "./EditExamination";
import AddExamination from "./AddExamination";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmBox from "../../../basicUtilityComponents/ConfirmBox";

const Examinations = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [examinations, setExaminations] = useState([]);
  const [selectedExamination, setSelectedExamination] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleDelete = () => {
    axios
      .delete(
        `${import.meta.env.VITE_API_URL}/api/examination/delete/${deleteId}`
      )
      .then((resp) => {
        fetchExamination();
        if (setMessage) setMessage(resp.data.message);
        if (setMessageType) setMessageType("success");
        if (setHandleMessageOpen) setHandleMessageOpen(true);
        setOpenConfirmBox(false);
      })
      .catch((e) => {
        console.log(e);
        if (setMessage) setMessage(e?.response?.data?.message);
        if (setMessageType) setMessageType("error");
        if (setHandleMessageOpen) setHandleMessageOpen(true);
        setOpenConfirmBox(false);
      });
  };

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
        <Button
          onClick={() => setOpenAddModal(true)}
          variant="contained"
          sx={{
            background: "#fff",
            border: "1px solid green",
            color: "#888",
            borderRadius: "50px",
            fontWeight: "600",
          }}
        >
          Add Examination
        </Button>
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

      {openAddModal && (
        <AddExamination
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchExamination={fetchExamination}
          selectedClass={selectedClass}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditExamination
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchExamination={fetchExamination}
          selectedClass={selectedClass}
          editId={selectedExamination?._id}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
          selectedExamination={selectedExamination}
        />
      )}

      {openConfirmBox && (
        <ConfirmBox
          openConfirmBox={openConfirmBox}
          setOpenConfirmBox={setOpenConfirmBox}
          cancel={() => setOpenConfirmBox(false)}
          confirm={handleDelete}
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
                <TableCell sx={{ fontWeight: "600" }} align="right">
                  Action
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
                    <TableCell align="right">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "end",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            border: "1px solid rgb(55, 216, 82)",
                            background: "#3df75c",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "5px",
                          }}
                          onClick={() => {
                            setOpenEditModal(true);
                            setSelectedExamination(examination);
                          }}
                        >
                          <EditIcon
                            style={{ fontSize: "16px", fontWeight: 600 }}
                          />
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            Edit
                          </Typography>
                        </Box>
                        <Box
                          onClick={() => {
                            setOpenConfirmBox(true);
                            setDeleteId(examination._id);
                          }}
                          sx={{
                            display: "flex",
                            justifyContent: "end",
                            alignItems: "center",
                            gap: 0.5,
                            cursor: "pointer",
                            border: "1px solid rgb(221, 53, 53)",
                            background: "rgba(248, 66, 66, 0.7)",
                            color: "white",
                            padding: "3px 8px",
                            borderRadius: "5px",
                          }}
                        >
                          <DeleteIcon
                            style={{ fontSize: "16px", fontWeight: 600 }}
                          />
                          <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                            Delete
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Examinations;
