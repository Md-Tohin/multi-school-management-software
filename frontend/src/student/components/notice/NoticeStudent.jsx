
import { Typography } from "@mui/material";
import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import MessageSnackbar from "../../../basicUtilityComponents/snackbar/MessageSnackbar";
import axios from "axios";

export default function NoticeStudent() {
  const [handleMessageOpen, setHandleMessageOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [notices, setNotices] = useState([]);

  function fetchNotice() {
    const params = { audience: "student" };
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
      </section>

      {handleMessageOpen && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          close={() => setHandleMessageOpen(false)}
        />
      )}

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
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
