import { useRef, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardMedia, TextField } from "@mui/material";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  pl: 1,
  pr: 4,
  py: 4,
};

export default function EditSchoolDetailModal({
  school,
  openEdit,
  setOpenEdit,
  fetchSchool,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  const [open, setOpen] = useState(openEdit);
  const handleClose = () => {
    setOpen(false);
    setOpenEdit(false);
  };

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(
    `/images/uploaded/school/${school.school_image}`
  );
  //  PREVIEW IMAGE
  const addImage = (event) => {
    const file = event.target.files[0];
    setImageUrl(URL.createObjectURL(file));
    setFile(file);
  };
  //  RESET IMAGE
  const fineInputRef = useRef(null);

  const [data, setData] = useState({
    school_name: school?.school_name,
    owner_name: school?.owner_name,
  });

  const handleChage = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    if (!data.school_name || !data.owner_name) {
        setHandleMessageOpen(true);
        setMessage("Input field is required");
        setMessageType("error");
        return false;
    }
    fd.append("school_name", data.school_name);
    fd.append("owner_name", data.owner_name);
    if (file) {
      fd.append("image", file, file.name);
    }
    try {
      const resp = await Axios({
        ...SummaryApi.updateSchool,
        data: fd,
      });
      if (resp.data.success) {
        setOpen(false);
        setOpenEdit(false);
        if (fetchSchool) {
          fetchSchool();
        }
        if (setHandleMessageOpen) {
          setHandleMessageOpen(true);
        }
        if (setMessage) {
          setMessage(resp.data.message);
        }
        if (setMessageType) {
          setMessageType("success");
        }
      }
    } catch (error) {
      console.log(error);
      if (setHandleMessageOpen) {
        setHandleMessageOpen(true);
      }
      if (setMessage) {
        setMessage("Updated failed");
      }
      if (setMessageType) {
        setMessageType("error");
      }
    }
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              onSubmit={handleSubmit}
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1.5, width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <div>
                <Typography sx={{ margin: "0 13px" }}>
                  Add School Picture
                </Typography>
                <TextField
                  type="file"
                  required={true}
                  inputRef={fineInputRef}
                  onChange={(event) => {
                    addImage(event);
                  }}
                />
                {imageUrl && (
                  <Box sx={{ padding: "0 0 10px 13px" }}>
                    <CardMedia
                      component={"img"}
                      height={"240px"}
                      image={imageUrl}
                    />
                  </Box>
                )}
              </div>
              <TextField
                name="school_name"
                label="School Name"
                defaultValue={data?.school_name}
                onChange={handleChage}
                required={true}
              />
              <TextField
                name="owner_name"
                label="Owner Name"
                defaultValue={data?.owner_name}
                onChange={handleChage}
                required={true}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%", marginLeft: "13px" }}
              >
                Update
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
