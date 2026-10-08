import { Navigate } from "react-router-dom";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FastField, Form, Formik } from "formik";

import { useUser } from "../hooks/useUser";
import LarpList from "../components/Events/LarpList";
import { useFetchUserLarps } from "../hooks/useFetchLarps";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { UserLarpVisibility } from "../types";
import FormikCheckbox from "../components/FormComponents/FormikCheckbox";
import { TextLink } from "../components/ui/TextLink";

export default function MyLarpsPage() {
  const { user } = useUser();
  const { data, isLoading } = useFetchUserLarps(user.username ?? undefined);

  const { mutate } = useMutation({
    mutationKey: ["user", user.username, "larp"],
    mutationFn(args: UserLarpVisibility) {
      if (!user.username) {
        throw new Error("Not logged in");
      }
      return LarpAPI.updateUserLarpVisibility(args, user.username);
    },
  });

  if (user.username === null) {
    return <Navigate to="/auth/login" />;
  }

  const header = (
    <Typography variant="h1" mb="2rem">
      My LARPs
    </Typography>
  );

  if (isLoading || !data) {
    return (
      <>
        {header}
        <LoadingSpinner />
      </>
    );
  }

  const { future, past } = data;

  return (
    <>
      {header}

      {(future !== null || past !== null) && (
        <Box mb="1rem">
          Share what LARPs you are going to{" "}
          <TextLink to={`/players/${user.username}/larps`}>here</TextLink>.
        </Box>
      )}

      <Formik
        initialValues={{
          future: future !== null,
          past: past !== null,
        }}
        onSubmit={(args) => mutate(args)}
      >
        {({ isValid }) => (
          <Form>
            <Typography component="h2" variant="h4">
              My visibility settings
            </Typography>
            <Stack direction="column" maxWidth="20rem">
              <FastField
                component={FormikCheckbox}
                name="future"
                label="Show future events"
              />
              <FastField
                component={FormikCheckbox}
                name="past"
                label="Show past events"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!isValid}
                sx={{ mt: "1rem" }}
              >
                Save
              </Button>
            </Stack>
          </Form>
        )}
      </Formik>

      <Typography variant="h2">Upcoming</Typography>

      <LarpList larps={future ?? []} noPagination />

      <Typography variant="h2">Past</Typography>

      <LarpList larps={past ?? []} noPagination />
    </>
  );
}
