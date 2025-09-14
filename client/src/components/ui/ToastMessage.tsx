import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Typography, Slide } from "@mui/material";

type ToastMessageProps = {
  messages: string[];
  title: string;
  severity?: "success" | "error";
};

function ToastMessage({
  messages,
  title,
  severity = "error",
}: ToastMessageProps) {
  const severityIcons = {
    success: faCheck,
    error: faX,
  };

  return (
    <>
      {messages.map((err) => (
        <Slide direction="down" in key={err}>
          <Alert
            sx={{
              position: "sticky",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
              zIndex: "1000",
            }}
            severity={severity}
            icon={<FontAwesomeIcon icon={severityIcons[severity]} />}
          >
            {title}:
            <Typography key="err" variant="details2">
              <br />
              {err}
            </Typography>
          </Alert>
        </Slide>
      ))}
    </>
  );
}

export default ToastMessage;
