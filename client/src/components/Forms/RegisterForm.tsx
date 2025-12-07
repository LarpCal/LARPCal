import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useCallback } from "react";
import { UserForCreate } from "../../types";

import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import { FastField, Form, Formik, FormikHelpers } from "formik";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import userRegistrationSchema from "./userRegistrationSchema";
import FormikCheckbox from "../FormComponents/FormikCheckbox";

type UserRegistrationData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  subscribed: boolean;
};

const DEFAULT_FORM_DATA: UserRegistrationData = {
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  subscribed: true,
};

type RegisterProps = {
  register: (userInfo: UserForCreate) => Promise<void>;
};

function UserRegistrationForm({ register }: RegisterProps) {
  const navigate = useNavigate();

  const handleRegister = useCallback(
    async (
      values: UserRegistrationData,
      helpers: FormikHelpers<UserRegistrationData>,
    ) => {
      try {
        await register({
          username: values.username,
          password: values.password,
          email: values.email,
          subscribed: values.subscribed,
        });
        navigate("/welcome");
      } catch (errs: unknown) {
        if (errs && typeof errs === "object" && "errors" in errs) {
          const apiErrors = (errs as { errors: Record<string, string[]> })
            .errors;
          for (const key in apiErrors) {
            helpers.setFieldError(key, apiErrors[key].join(", "));
          }
        }
      }
    },
    [register, navigate],
  );

  return (
    <Formik
      initialValues={DEFAULT_FORM_DATA}
      onSubmit={handleRegister}
      validationSchema={userRegistrationSchema}
    >
      {({ isValid }) => (
        <Form className="RegistrationForm">
          <Stack direction="column" spacing={2}>
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              id="username"
              label="User name"
              name="username"
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              type="password"
              id="password"
              label="Password"
              name="password"
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              type="password"
              id="confirmPassword"
              label="Confirm password"
              name="confirmPassword"
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              id="email"
              label="Email"
              name="email"
            />
            <FastField
              component={FormikCheckbox}
              label="Subscribe to LARPCal announcements"
              name="subscribed"
              id="subscribed"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isValid ? false : true}
            >
              {" "}
              Sign Up{" "}
            </Button>
            <Typography component="p" variant="caption" align="center">
              Already Registered?<Link to="/LogIn"> Log In</Link>
            </Typography>
            {/* {error && <ErrorDisplay message={error}/>} */}
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default UserRegistrationForm;
