// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import {
  Button,
  Fade,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import { noticeSchema } from "../../../yupSchema/noticeSchema";

export default function AddNotice({
  openAddModal,
  setOpenAddModal,
  fetchNotice,
  setHandleMessageOpen,
  setMessage,
  setMessageType,
}) {
  const [open, setOpen] = useState(openAddModal);
  const handleClose = () => {
    setOpen(false);
    setOpenAddModal(false);
  };

  const initialValues = {
    title: "",
    message: "",
    audience: "",
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: noticeSchema,
    onSubmit: async (values) => {
      try {
        const response = await Axios({
          ...SummaryApi.createNotice,
          data: { ...values },
        });

        const { data: resp } = response;
        if (resp.success) {
          Formik.resetForm();
          if (setOpenAddModal) setOpenAddModal(false);
          if (fetchNotice) fetchNotice();
          if (setMessage) setMessage(resp.message);
          if (setMessageType) setMessageType("success");
          if (setHandleMessageOpen) setHandleMessageOpen(true);
        }
      } catch (error) {
        console.log(error);
        if (setMessage) setMessage(error?.response?.data?.message);
        if (setMessageType) setMessageType("error");
        if (setHandleMessageOpen) setHandleMessageOpen(true);
      }
    },
  });

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    bgcolor: "background.paper",
    boxShadow: 24,
    pl: 4,
    pr: 4,
    py: 4,
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openAddModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openAddModal}>
          <Box sx={style}>
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              Add Notice
            </Typography>
            <Box
              onSubmit={Formik.handleSubmit}
              component="form"
              sx={{
                display: "grid",
                gridTemplateColumns: "1fr",
                margin: "0 auto",
                gap: 2,
                maxHeight: "80vh",
                overflow: "auto",
                paddingTop: "1.5rem",
              }}
              noValidate
              autoComplete="off"
            >
              <Box>
                <TextField
                  name="title"
                  label="Title"
                  value={Formik.values.title}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                  style={{ width: "100%" }}
                />
                {Formik.touched.title && Formik.errors.title && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.title}
                  </p>
                )}
              </Box>
              <Box style={{ width: "100%" }}>
                <textarea
                  name="message"
                  style={{
                    borderRadius: "4px",
                    fontSize: "16px",
                    width: "100%",
                    padding: "10px",
                    fontFamily: "sans-serif",
                  }}
                  placeholder="Message"
                  rows={5}
                  defaultValue={Formik.values.message}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                >
                  {/* {Formik.values.message} */}
                </textarea>
                {Formik.touched.message && Formik.errors.message && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.message}
                  </p>
                )}
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Audience
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={Formik.values.audience}
                    label="Select Audience"
                    name="audience"
                    onChange={Formik.handleChange}
                    onBlur={Formik.handleBlur}
                  >
                    <MenuItem value={""}>Select Audience</MenuItem>
                    <MenuItem value={"student"}>Student</MenuItem>
                    <MenuItem value={"teacher"}>Teacher</MenuItem>
                    <MenuItem value={"all"}>All</MenuItem>
                  </Select>
                </FormControl>
                {Formik.touched.audience && Formik.errors.audience && (
                  <p
                    style={{
                      color: "red",
                      textTransform: "",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {Formik.errors.audience}
                  </p>
                )}
              </Box>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    width: "30%",
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
