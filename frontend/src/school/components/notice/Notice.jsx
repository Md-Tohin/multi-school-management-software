import { Button, Typography } from "@mui/material";
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
import AddNotice from "./AddNotice";
import EditNotice from "./EditNotice";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Notice = () => {
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [notices, setNotices] = useState([]);
  const [openConfirmBox, setOpenConfirmBox] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedTab, setSelectedTab] = useState("all");

  const [params, setParams] = useState({});

  const handleSortNotice = (value) => {
    setSelectedTab(value);
    setParams((prevParams) => ({
      ...prevParams,
      audience: value || "",
    }));
  };

  function fetchNotice() {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/notice/all`, {
        params,
      })
      .then((resp) => {
        if (resp.data.success) {
          setNotices(resp.data.notices);
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
    fetchNotice();
  }, [selectedTab]);

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
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/notice/delete/${deleteId}`)
      .then((resp) => {
        fetchNotice();
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
        <h2>Notices</h2>
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
          Add Notice
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
        <AddNotice
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchNotice={fetchNotice}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditNotice
          selectedNotice={selectedNotice}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchNotice={fetchNotice}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      <Box sx={{ display: "flex", gap: 1.5 }}>
        <Button
          variant={`${selectedTab === "all" ? "contained" : "outlined"}`}
          onClick={() => handleSortNotice("all")}
        >
          All Notices
        </Button>
        <Button
          variant={`${selectedTab === "student" ? "contained" : "outlined"}`}
          onClick={() => handleSortNotice("student")}
        >
          Student Notices
        </Button>
        <Button
          variant={`${selectedTab === "teacher" ? "contained" : "outlined"}`}
          onClick={() => handleSortNotice("teacher")}
        >
          Teacher Notices
        </Button>
      </Box>

      <Box component={"div"} sx={{ paddingTop: "1rem" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {notices.map((item, index) => (
              <Grid item xs={2} sm={4} md={3} key={item._id + "notice" + index}>
                <Item>
                  <Typography
                    sx={{
                      fontSize: "1.1rem",
                      color: "#333",
                      fontWeight: 600,
                      paddingTop: "0.5rem",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#888",
                      fontWeight: 600,
                      letterSpacing: "0.3px",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.audience}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      color: "#888",
                      fontWeight: 500,
                      letterSpacing: "0.3px",
                    }}
                  >
                    {item.message}
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
                    <button
                      onClick={() => {
                        setOpenEditModal(true);
                        setSelectedNotice(item);
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
                    </button>
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

export default Notice;
