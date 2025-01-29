import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export default function MessageSnackbar({ message, messageType, close }) {
  return (
    <Snackbar open={true} autoHideDuration={5000} onClose={close}>
      <Alert
        onClose={close}
        severity={messageType}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
