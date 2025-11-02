import { Button, Stack } from "@mui/material";
import { FastField, Form, useFormikContext } from "formik";
import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import { Newsletter } from "../../types";
import { MouseEventHandler, useMemo } from "react";
import ErrorDisplay from "../FormComponents/ErrorDisplay";

interface NewsletterFormProps {
  onCancel: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}

export function NewsletterForm({
  onCancel,
  disabled = false,
}: NewsletterFormProps) {
  const { isValid, errors, dirty } = useFormikContext<Newsletter>();
  const errorMessage = useMemo(
    () =>
      `Please check following fields to continue: ${Object.keys(errors)
        .map((key) => (key !== "steps" ? key : null))
        .join(", ")}`,
    [errors],
  );
  return (
    <Form>
      <Stack spacing={2} sx={{ my: "1rem" }}>
        <FastField
          component={FormikMuiTextField}
          name="subject"
          id="subject"
          label="Subject"
          disabled={disabled}
        />
        <FastField
          component={FormikMuiTextField}
          name="text"
          id="text"
          label="Text"
          multiline
          minRows={10}
          maxRows={30}
          disabled={disabled}
        />

        {!isValid && <ErrorDisplay message={errorMessage} />}
      </Stack>
      <Stack direction="row" alignContent="center" spacing={2}>
        <Button
          color="success"
          type="submit"
          variant="contained"
          disabled={!isValid || !dirty || disabled}
        >
          Save
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={onCancel}
          disabled={disabled}
        >
          Cancel
        </Button>
      </Stack>
    </Form>
  );
}
