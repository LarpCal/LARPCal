import { Box, Button, Stack, Typography } from "@mui/material";
import { LarpQuery } from "../../types";
import { FastField, Field, Form, useFormikContext } from "formik";
import FormikMuiTextField from "../FormComponents/FormikMuiTextField";
import FormikSelectInput from "../FormComponents/FormikSelectInput";
import FormikDateTimePicker from "../FormComponents/FormikDateTimePicker";
import { DateTime } from "luxon";

function FilterLarpsFormFields() {
  const { isValid, values } = useFormikContext<LarpQuery>();

  const fieldsetStyle = {
    border: "none",
    borderRadius: "1rem",
    margin: ".5rem",
    padding: ".5rem",
    width: "100%",
  };

  const inputStyle = {
    boxSizing: "border-box",
    backgroundColor: "white",
    margin: ".5rem",
    flex: "1 1 auto",
  };

  return (
    <Box
      component={Form}
      sx={{
        padding: "1rem",
        border: "none",
        width: "100%",
      }}
      className="filled-light"
    >
      <Typography mx="2rem" variant="h3" align="center">
        {" "}
        Advanced Search{" "}
      </Typography>
      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        component="fieldset"
        sx={fieldsetStyle}
      >
        <Field
          component={FormikSelectInput}
          size="small"
          sx={{
            ...inputStyle,
            marginRight: "0px",
            minWidth: "15rem",
            flex: "0 0 auto",
          }}
          options={[
            { label: "Available", value: "AVAILABLE" },
            { label: "Limited", value: "LIMITED" },
            { label: "Sold Out", value: "SOLD_OUT" },
          ]}
          placeholder="AVAILABLE"
          name="ticketStatus"
          id="filter-ticketStatus"
          label="Ticket Availability"
        />
        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={{
            ...inputStyle,
            boxSizing: "border-box",
            flex: "1",
          }}
          placeholder=""
          name="term"
          id="filter-term"
          label="Search Term"
        />
        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={{
            ...inputStyle,
            flex: "1 1 100%",
          }}
          placeholder=""
          name="title"
          id="filter-title"
          label="Title"
        />
        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={{
            ...inputStyle,
            flex: "1 1 100%",
          }}
          placeholder=""
          name="tags"
          id="filter-tags"
          label="Tags"
        />
      </Stack>

      <Box component="fieldset" sx={fieldsetStyle}>
        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center">
          <Typography sx={{ minWidth: "100px" }} align="right">
            {" "}
            Start Date:{" "}
          </Typography>
          <FastField
            component={FormikDateTimePicker}
            size="small"
            sx={inputStyle}
            placeholder={DateTime.now()}
            name="startAfter"
            id="larp-startAfter"
            label="Starts After"
            value={DateTime.fromISO(values.startAfter || "")}
          />
          <FastField
            component={FormikDateTimePicker}
            size="small"
            sx={inputStyle}
            placeholder={DateTime.now()}
            name="startBefore"
            id="larp-startBefore"
            label="Starts Before"
            value={DateTime.fromISO(values.startBefore || "")}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} alignItems="center">
          <Typography sx={{ minWidth: "100px" }} align="right">
            {" "}
            End Date:{" "}
          </Typography>
          <FastField
            component={FormikDateTimePicker}
            size="small"
            sx={inputStyle}
            placeholder={DateTime.now()}
            name="endAfter"
            id="larp-endAfter"
            label="Ends After"
            value={DateTime.fromISO(values.endAfter || "")}
          />
          <FastField
            component={FormikDateTimePicker}
            size="small"
            sx={inputStyle}
            placeholder={DateTime.now()}
            name="endBefore"
            id="larp-endBefore"
            label="Ends Before"
            value={DateTime.fromISO(values.endBefore || "")}
          />
        </Stack>
      </Box>

      <Stack
        direction={"row"}
        flexWrap={"wrap"}
        component="fieldset"
        sx={fieldsetStyle}
      >
        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={inputStyle}
          placeholder=""
          name="city"
          id="filter-city"
          label="City"
        />

        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={inputStyle}
          placeholder=""
          name="country"
          id="filter-country"
          label="Country"
        />

        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={inputStyle}
          placeholder=""
          name="language"
          id="filter-language"
          label="Language"
        />

        <FastField
          component={FormikMuiTextField}
          size="small"
          sx={inputStyle}
          placeholder=""
          name="organizer"
          id="filter-organizer"
          label="Organizer"
        />
      </Stack>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{
          margin: "auto",
          display: "block",
        }}
        disabled={isValid ? false : true}
      >
        <Typography variant="h3">Search</Typography>
      </Button>
    </Box>
  );
}

export default FilterLarpsFormFields;
