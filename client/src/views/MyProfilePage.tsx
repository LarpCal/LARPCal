import { useContext } from "react";
import { userContext } from "../context/userContext";
import { FastField, Form, Formik } from "formik";
import { Navigate, useNavigate } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import FormikMuiTextField from "../components/FormComponents/FormikMuiTextField";
import { User, UserForUpdate } from "../types";
import userUpdateSchema from "../components/Forms/userUpdateSchema";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function MyProfilePage() {
  const {
    user: maybeNullUser,
    update,
    loading,
    error,
  } = useContext(userContext);
  const navigate = useNavigate();
  if (maybeNullUser.username === null) {
    return <Navigate to="/auth/login" />;
  }
  const user = maybeNullUser as User;

  async function handleSubmit(formData: UserForUpdate) {
    if (loading) {
      return;
    }
    await update(formData);
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
      initialValues={user}
      validationSchema={userUpdateSchema}
      onSubmit={handleSubmit}
    >
      {({ isValid }) => (
        <Form className="UserUpdateForm">
          <Stack direction="column" spacing={2} sx={{ margin: "1rem" }}>
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              id="username"
              label="User name"
              name="username"
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

export default MyProfilePage;
