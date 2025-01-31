/* eslint-disable no-unused-vars */
import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import React, { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function ConfirmBox({
  cancel,
  confirm,
  openConfirmBox,
  setOpenConfirmBox,
}) {
  const [open, setOpen] = useState(true);
  const handleClose = () => {
    setOpen(false);
    setOpenConfirmBox(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    pl: 3,
    pr: 3,
    py: 3,
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={openConfirmBox}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={openConfirmBox}>
          <Box sx={style}>
            <Typography
              variant="p"
              sx={{ fontWeight: "600", fontSize: "18px" }}
            >
              Permanent Delete
            </Typography>
            <Typography sx={{ fontSize: "16px", padding: "0.7rem 0" }}>
              Are you sure permanent delete?
            </Typography>
            <Box
              component={"div"}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Button
                onClick={cancel}
                sx={{
                  margin: "0.5rem 0",
                  border: "1px solid red",
                  color: "red",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={confirm}
                sx={{
                  margin: "0.5rem 0",
                  border: "1px solid green",
                  color: "green",
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
