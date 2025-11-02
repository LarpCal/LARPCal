import { Form, useFormikContext } from "formik";
import { Larp } from "../../types";

import { Box, Button, Stack, Typography } from "@mui/material";

import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import FormikSelectInput from "../FormComponents/FormikSelectInput";
import FormikDateTimePicker from "../FormComponents/FormikDateTimePicker";
import ErrorDisplay from "../FormComponents/ErrorDisplay";
import { FastField, Field } from "formik";
import { DateTime } from "luxon";

// type EventFormProps = {
// };

function EventForm() {
  const { isValid, errors } = useFormikContext<Larp>();
  const errorMessage = `
        Please check following fields to continue:
        ${Object.keys(errors)
          .map((key) => {
            return key !== "steps" ? key : null;
          })
          .join(", ")}
    `;

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
              placeholder="Name your LARP"
              name="title"
              id="larp-title"
              label="LARP title"
              fullWidth
            />
            <Field
              component={FormikSelectInput}
              options={[
                { label: "Available", value: "AVAILABLE" },
                { label: "Limited", value: "LIMITED" },
                { label: "Sold Out", value: "SOLD_OUT" },
                { label: "Coming Soon", value: "SOON" },
              ]}
              placeholder={"AVAILABLE"}
              name="ticketStatus"
              id="larp-ticketStatus"
              label="Ticket Status"
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="Add a description for your LARP"
              name="description"
              id="larp-description"
              label="LARP description"
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="What city will your LARP take place in"
              name="city"
              id="larp-city"
              label="City"
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="What country will your LARP take place in?"
              name="country"
              id="larp-country"
              label="Country"
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="What is the primary language for your LARP?"
              name="language"
              id="larp-language"
              label="Language"
            />
            <Field
              component={FormikDateTimePicker}
              disablePast
              placeholder={DateTime.now()}
              name="start"
              id="larp-start"
              label="Start Date"
            />
            <Field
              component={FormikDateTimePicker}
              disablePast
              placeholder={DateTime.now().plus({ hours: 1 })}
              name="end"
              id="larp-end"
              label="End Date"
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="Separate your tags using commas"
              name="tags"
              id="larp-tags"
              label="Tags"
              fullWidth
            />
            <Box className="Recipe-submitButton">
              <Stack direction="row" alignContent="center" spacing={2}>
                {!isValid && <ErrorDisplay message={errorMessage} />}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isValid ? false : true}
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

export default EventForm;
