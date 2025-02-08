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
import AddTeacher from "./AddTeacher";
import EditTeacher from "./EditTeacher";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Teachers = () => {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [teachers, setTeachers] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [actionOpen, setActionOpen] = useState(false);
  const actionRef = useRef(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const handleActionOpen = (teacherId) => {
    setSelectedTeacherId(selectedTeacherId === teacherId ? null : teacherId);
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
      teacher_class: e.target.value || undefined,
    }));
  };
  const handleSearch = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      search: e.target.value || undefined,
    }));
  };
  const handleTeacherId = (e) => {
    setParams((prevParams) => ({
      ...prevParams,
      teacher_id: e.target.value || undefined,
    }));
  };
  function fetchTeacher() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/teacher/fetch-with-query`, {
        params,
      })
      .then((resp) => {
        if (resp.data.success) {
          setTeachers(resp.data.teachers);
        }
      })
      .catch((e) => {
        console.log(e);
        setMessage(e?.response?.data?.message);
        setMessageType("error");
        setHandleMessageOpen(true);
      });
  }

  useEffect(() => {
    fetchTeacher();
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
      .delete(`${import.meta.env.VITE_API_URL}/api/teacher/delete/${deleteId}`)
      .then((resp) => {
        fetchTeacher();
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
        <h2>Teachers</h2>
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
          Add Teacher
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
        <AddTeacher
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchTeacher={fetchTeacher}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditTeacher
          selectedTeacher={selectedTeacher}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchTeacher={fetchTeacher}
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
            label="Teacher ID"
            value={params.teacher_id ? params.teacher_id : ""}
            onChange={(e) => {
              handleTeacherId(e);
            }}
            style={{ background: "white", width: "250px" }}
          />
        </Box>
        <Box>
          <TextField
            label="Teacher Name"
            value={params.search ? params.search : ""}
            onChange={(e) => {
              handleSearch(e);
            }}
            style={{ background: "white", width: "250px" }}
          />
        </Box>
      </Box>

      <Box component={"div"} sx={{ paddingTop: "1rem" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {teachers.map((item, index) => (
              <Grid
                item
                xs={2}
                sm={4}
                md={3}
                key={item._id + "teacher" + index}
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
                    //   setSelectedTeacher(item);
                    // }}
                    onClick={() => handleActionOpen(item._id)}
                  >
                    <MoreVertIcon />
                  </Box>
                  { selectedTeacherId === item._id && (
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
                        setSelectedTeacher(item);
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
                      src={`/images/uploaded/teacher/${item.teacher_image}`}
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
                      color: "#555",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.qualification}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.teacher_id}
                  </Typography>                      
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default Teachers;
