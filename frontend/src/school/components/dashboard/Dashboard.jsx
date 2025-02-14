import { useEffect, useState } from "react";
import SummaryApi from "../../../common/SummaryApi";
import Axios from "../../../utils/Axios";
import { Box, Button, Typography } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditSchoolDetailModal from "./EditSchoolDetailModal";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";

const Dashboard = () => {  
  const [school, setSchool] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  async function fetchSchool() {
    try {
      const response = await Axios({
        ...SummaryApi.getSchoolOwnData,
      });

      if (response.data.success) {
        console.log(response.data.school)
        setSchool(response.data.school);
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    fetchSchool();
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
        <h2 style={{}}>Dashboard</h2>
      </section>
      {handleMessageOpen && (
          <MessageSnackbar
            message={message}
            messageType={messageType}
            close={() => setHandleMessageOpen(false)}
          />
        )}

      {
        openEdit && (
          <>
            <EditSchoolDetailModal school={school} openEdit={openEdit} setOpenEdit={setOpenEdit} fetchSchool={fetchSchool} setHandleMessageOpen={setHandleMessageOpen} setMessage={setMessage} setMessageType={setMessageType} />
          </>
        )
      }
      <Box
        component={"div"}
        sx={{
          position: "relative",
          width: "100%",
          height: "450px",
          border: "1px solid green",
          borderRadius: "10px",
        }}
      >
        {school && (
          <>
            <img
              src={`/images/uploaded/school/${school?.school_image}`}
              alt="image"
              style={{ width: "100%", height: "100%", borderRadius: "10px" }}
            />
            <Box
              component={"div"}
              sx={{
                position: "absolute",
                left: "50%",
                top: "40%",
                transform: "translateX(-50%)",
              }}
            >
              <Box sx={{ background: "rgb(74 69 69)", padding: "1rem 2rem", borderRadius: "10px" }}>
                <Typography component={"h2"} variant="" sx={{color: "white"}}>
                  {school.school_name}
                </Typography>
              </Box>
            </Box>
          </>
        )}

        <Box
          component={"div"}
          sx={{ position: "absolute", bottom: "5px", right: "5px" }}
        >
          <Button
            onClick={() => setOpenEdit(true)}
            style={{
              height: "60px",
              borderRadius: "50%",
              background: "#d1d1d1",
              color: "black",
              border: "1px silid red",
            }}
          >
            <EditIcon />
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
