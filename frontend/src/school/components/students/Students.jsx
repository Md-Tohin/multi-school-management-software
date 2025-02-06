import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ConfirmBox from "../../../basicUtilityComponents/ConfirmBox";
import AddStudent from "./AddStudent";
import EditStudent from "./EditStudent";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Students = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);
  const actionRef = useRef(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const handleActionOpen = (studentId) => {
    setSelectedStudentId(selectedStudentId === studentId ? null : studentId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActionOpen(false);
      }
    }

    // Attach event listener when actionOpen is true
    if (actionOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [actionOpen]);

  const [params, setParams] = useState({});
  const handleClass = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      student_class: e.target.value || undefined,
    }));
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
        console.log(resp);
        if (resp.data.success) {
          setStudents(resp.data.students);
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

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    ...theme.applyStyles("dark", {
      backgroundColor: "#1A2027",
    }),
  }));

  const handleDelete = () => { 
    console.log("Deleted id : ", deleteId);       
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/student/delete/${deleteId}`)
      .then((resp) => {
        fetchStudent();
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
        <h2>Students</h2>
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
          Add Student
        </Button>
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
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

      {openAddModal && (
        <AddStudent
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchStudent={fetchStudent}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditStudent
          classes={classes}
          selectedStudent={selectedStudent}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchStudent={fetchStudent}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      <Box
        component={"div"}
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          gap: 3,
          paddingBottom: "1rem",
        }}
      >
        <Box>
          <TextField
            label="Student ID"
            value={params.student_id ? params.student_id : ""}
            onChange={(e) => {
              handleStudentId(e);
            }}
            style={{ background: "white", width: "250px" }}
          />
        </Box>
        <Box>
          <TextField
            label="Student Name"
            value={params.search ? params.search : ""}
            onChange={(e) => {
              handleSearch(e);
            }}
            style={{ background: "white", width: "250px" }}
          />
        </Box>

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
                    <MenuItem key={item._id + "class" + index} value={item._id}>
                      {item.class_text} ({item.class_num})
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box component={"div"} sx={{ paddingTop: "1rem" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {students.map((item, index) => (
              <Grid
                item
                xs={2}
                sm={4}
                md={3}
                key={item._id + "student" + index}
              >
                <Item sx={{ position: "relative" }} ref={actionRef}>
                  <Box
                    sx={{
                      position: "absolute",
                      top: "15px",
                      right: "10px",
                      cursor: "pointer",
                    }}
                    // onClick={() => {
                    //   setActionOpen(true);
                    //   setSelectedStudent(item);
                    // }}
                    onClick={() => handleActionOpen(item._id)}
                  >
                    <MoreVertIcon />
                  </Box>
                  { selectedStudentId === item._id && (
                      <Box
                    sx={{
                      position: "absolute",
                      top: "45px",
                      right: "10px",
                      border: "1px solid #d1d1d1",
                      padding: "5px 10px",
                      borderRadius: "5px",
                      background: "white"
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 1,
                        marginBottom: "5px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setOpenEditModal(true);
                        setSelectedStudent(item);
                      }}
                    >
                      <EditIcon style={{ fontSize: "16px", fontWeight: 600 }} />
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
                        Edit
                      </Typography>
                    </Box>
                    <Box
                      onClick={() => {
                        setOpenConfirmBox(true);
                        setDeleteId(item._id);
                      }}
                      sx={{
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 1,
                        cursor: "pointer",
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
                  )}
                  <Box>
                    <img
                      src={`/images/uploaded/student/${item.student_image}`}
                      alt={item.name}
                      style={{
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      color: "#333",
                      fontWeight: 600,
                      paddingTop: "0.5rem",
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.student_id}
                  </Typography>
                  <Box
                    component={"div"}
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    {/* <button
                      onClick={() => {
                        setOpenEditModal(true);
                        setSelectedStudent(item);
                      }}
                      style={{
                        padding: "2px 5px",
                        background: "green",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => {
                        setOpenConfirmBox(true);
                        setDeleteId(item._id);
                      }}
                      style={{
                        padding: "2px 5px",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                    >
                      <DeleteIcon />
                    </button> */}
                  </Box>
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Students;
