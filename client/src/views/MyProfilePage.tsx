import { FastField, Form, Formik } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Stack, TextField } from "@mui/material";
import FormikMuiTextField from "../components/FormComponents/FormikMuiTextField";
import { PublicUser, UserForUpdate } from "../types";
import userUpdateSchema from "../components/Forms/userUpdateSchema";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useUser } from "../hooks/useUser";
import FormikCheckbox from "../components/FormComponents/FormikCheckbox";

export default function MyProfilePage() {
  const { user: maybeNullUser, update, loading, error } = useUser();
  const navigate = useNavigate();
  if (maybeNullUser.username === null) {
    return <Navigate to="/auth/login" />;
  }
  const user = maybeNullUser as PublicUser;

  async function handleSubmit(
    formData: UserForUpdate & { confirmPassword?: string },
  ) {
    if (loading) {
      return;
    }
    delete formData.confirmPassword;
    const userData = formData.password
      ? formData
      : { ...formData, password: undefined };
    await update(userData);
    if (error) {
      return;
    }
    navigate("/");
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Formik
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        subscribed: user.subscribed,
        password: "",
        confirmPassword: "",
      }}
      validationSchema={userUpdateSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className="UserUpdateForm">
          <Stack direction="column" spacing={2} sx={{ margin: "1rem" }}>
            <TextField
              variant="outlined"
              label="Username"
              value={user.username}
              disabled
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              id="email"
              label="Email"
              name="email"
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              id="firstName"
              label="First Name"
              name="firstName"
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              id="lastName"
              label="Last Name"
              name="lastName"
            />
            <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
              <FastField
                component={FormikMuiTextField}
                variant="outlined"
                type="password"
                id="password"
                label="Password"
                name="password"
                fullWidth
              />
              <FastField
                component={FormikMuiTextField}
                variant="outlined"
                type="password"
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                fullWidth
              />
            </Stack>
            <FastField
              component={FormikCheckbox}
              id="subscribed"
              label="Subscribe to LARPCal news"
              name="subscribed"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isValid ? false : true}
            >
              Update Account
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
