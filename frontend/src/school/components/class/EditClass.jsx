// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Button, Fade, Modal, TextField, Typography } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import { useFormik } from "formik";
import { classSchema } from "../../../yupSchema/classSchema";
import Axios from "../../../utils/Axios";
import SummaryApi from "../../../common/SummaryApi";
import axios from "axios";

export default function EditClass({ selectedClass, openEditModal, setOpenEditModal, fetchClass, setHandleMessageOpen, setMessage, setMessageType }) {
  const [open, setOpen] = useState(openEditModal);
  const handleClose = () => {
    setOpen(false);
    setOpenEditModal(false);
  };

  const initialValues = {
    class_text: selectedClass.class_text,
    class_num: selectedClass.class_num,
  };

  //  FROM SUBMIT
  const Formik = useFormik({
    initialValues,
    validationSchema: classSchema,
    onSubmit: async (values) => {      
      axios.patch(`${import.meta.env.VITE_API_URL}/api/class/update/${selectedClass._id}`, {...values})
      .then(resp => {        
        Formik.resetForm();
          if(setOpenEditModal) setOpenEditModal(false);
          if(fetchClass) fetchClass();
          if(setMessage) setMessage(resp.data.message);
          if(setMessageType) setMessageType("success");
          if(setHandleMessageOpen) setHandleMessageOpen(true);
      })
      .catch((error) => {
        console.log(error);
        if(setMessage) setMessage(error?.response?.data?.message);
        if(setMessageType) setMessageType("error");
        if(setHandleMessageOpen) setHandleMessageOpen(true);
      })
    },
  });

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

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openEditModal}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openEditModal}>
          <Box sx={style}>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", fontWeight: "600" }}
            >
              Edit Class
            </Typography>
            <Box
              onSubmit={Formik.handleSubmit}
              component="form"
              sx={{ "& .MuiTextField-root": { m: 1, mx: 1.5, width: "100%" } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                name="class_text"
                label="Class Text"
                value={Formik.values.class_text}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                style={{ marginTop: "15px" }}
              />
              {Formik.touched.class_text && Formik.errors.class_text && (
                <p
                  style={{
                    color: "red",
                    textTransform: "",
                    fontWeight: "600",
                    fontSize: "14px",
                    paddingLeft: "12px ",
                  }}
                >
                  {Formik.errors.class_text}
                </p>
              )}

              <TextField
                name="class_num"
                label="Class Number"
                value={Formik.values.class_num}
                onChange={Formik.handleChange}
                onBlur={Formik.handleBlur}
                style={{ marginTop: "15px" }}
              />
              {Formik.touched.class_num && Formik.errors.class_num && (
                <p
                  style={{
                    color: "red",
                    textTransform: "",
                    fontWeight: "600",
                    fontSize: "14px",
                    paddingLeft: "12px ",
                  }}
                >
                  {Formik.errors.class_num}
                </p>
              )}

              <Button
                type="submit"
                variant="contained"
                sx={{ width: "100%", marginTop: "13px", marginLeft: "13px" }}
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
