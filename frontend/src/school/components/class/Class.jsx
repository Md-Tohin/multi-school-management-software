import { Button, Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import AddClass from "./AddClass";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditClass from "./EditClass";
import axios from "axios";

const Class = () => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [classes, setClasses] = useState([]);

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

  const handleDelete = (id) => {   
    axios.delete(`${import.meta.env.VITE_API_URL}/api/class/delete/${id}`)
      .then((resp) => {
          fetchClass();
          if(setMessage) setMessage(resp.data.message);
          if(setMessageType) setMessageType("success");
          if(setHandleMessageOpen) setHandleMessageOpen(true);
      })
      .catch((e) => {
        console.log(e);        
        if(setMessage) setMessage(e?.response?.data?.message);
        if(setMessageType) setMessageType("error");
        if(setHandleMessageOpen) setHandleMessageOpen(true);
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
        <h2>Class</h2>
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
          Add Class
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
        <AddClass
          openAddModal={openAddModal}
          setOpenAddModal={setOpenAddModal}
          fetchClass={fetchClass}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      {openEditModal && (
        <EditClass
          selectedClass={selectedClass}
          openEditModal={openEditModal}
          setOpenEditModal={setOpenEditModal}
          fetchClass={fetchClass}
          setHandleMessageOpen={setHandleMessageOpen}
          setMessage={setMessage}
          setMessageType={setMessageType}
        />
      )}

      <Box component={"div"}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {classes.map((item, index) => (
              <Grid item xs={2} sm={4} md={4} key={item._id + "class" + index}>
                <Item>
                  <Typography sx={{ fontSize: "20px" }}>
                    {item.class_text}
                  </Typography>
                  <Typography>{item.class_num}</Typography>
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
                        setSelectedClass(item);
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
                      onClick={() => handleDelete(item._id)}
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

export default Class;
