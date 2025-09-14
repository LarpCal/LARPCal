import { useLocation, useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";

import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import { Formik, FastField, Form } from "formik";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import ChangePasswordSchema from "./changePasswordSchema";
import LarpAPI from "../../util/api";
import { Alert, Box, Typography } from "@mui/material";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ChangePasswordData = {
  password: string;
  confirmPassword: string;
};

const DEFAULT_FORM_DATA: ChangePasswordData = {
  password: "",
  confirmPassword: "",
};

function ChangePasswordForm() {
  const navigate = useNavigate();
  const [_error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  if (!token) {
    navigate("/auth/password-reset/request");
  }

  async function changePassword(values: ChangePasswordData) {
    try {
      await LarpAPI.updatePassword({
        token: token!,
        password: values.password,
      });
      setError(null);
      setAlert({
        success: true,
        message: "Your password has been updated!",
      });
    } catch (err) {
      setAlert({
        success: false,
        message: (err as string[]).join(" "),
      });
    }
  }

  return (
    <Stack
      justifyContent={"center"}
      sx={{
        padding: "3rem",
      }}
      spacing={2}
    >
      <Typography component="h1" variant="h1">
        Enter your new password
      </Typography>
      <Box
        sx={{
          // padding: '1rem',
          width: "100%",
          marginTop: "2rem",
        }}
      >
        <Formik
          initialValues={DEFAULT_FORM_DATA}
          onSubmit={async (values) => await changePassword(values)}
          validationSchema={ChangePasswordSchema}
        >
          {({ isValid }) => (
            <Form className="RegistrationForm">
              <Stack direction="column" spacing={2}>
                <FastField
                  component={FormikMuiTextField}
                  variant="outlined"
                  size="small"
                  type="password"
                  id={`password`}
                  label="password"
                  name={`password`}
                />
                <FastField
                  component={FormikMuiTextField}
                  variant="outlined"
                  size="small"
                  type="password"
                  id={`confirmPassword`}
                  label="confirm password"
                  name={`confirmPassword`}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={
                    isValid && (!alert || alert.success !== true) ? false : true
                  }
                >
                  {" "}
                  Update Password
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
        {alert && alert.success === true && (
          <Button component={RouterLink} to="/auth/login">
            Log In
          </Button>
        )}
      </Box>
      {alert !== null && (
        <Alert
          sx={{
            height: "100%",
            width: "100%",
            zIndex: "1000",
          }}
          severity={alert.success === true ? "success" : "error"}
          icon={
            <FontAwesomeIcon icon={alert.success === true ? faCheck : faX} />
          }
        >
          {alert.message}
        </Alert>
      )}
    </Stack>
  );
}

export default ChangePasswordForm;
