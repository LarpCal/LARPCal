import { Organization } from "../../types";
import { Form, useFormikContext } from "formik";
import { FastField } from "formik";
import { Box, Button, Stack, Typography } from "@mui/material";
import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import ErrorDisplay from "../FormComponents/ErrorDisplay";
import { useMemo } from "react";

function OrgForm() {
  const { isValid, errors } = useFormikContext<Organization>();
  const errorMessage = useMemo(
    () =>
      `Please check following fields to continue: ${Object.keys(errors)
        .map((key) => (key !== "steps" ? key : null))
        .join(", ")}`,
    [errors],
  );

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Form>
          <Stack direction="column" spacing={2} sx={{ margin: "1rem" }}>
            <FastField
              component={FormikMuiTextField}
              name="orgName"
              id="orgName"
              label="Organization Name"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="https://example.com"
              name="orgUrl"
              id="orgUrl"
              label="Website"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="email"
              name="email"
              id="email"
              label="email"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="Add a description for your organization"
              name="description"
              id="description"
              label="Description"
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
            />

            <Box className="submitButton">
              <Stack direction="row" alignContent="center" spacing={2}>
                {!isValid && <ErrorDisplay message={errorMessage} />}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!isValid}
                >
                  <Typography variant="h5">Save Changes</Typography>
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Form>
      </Box>
    </>
  );
}

export default OrgForm;
