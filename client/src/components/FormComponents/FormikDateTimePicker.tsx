import { TextField, TextFieldProps } from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/x-date-pickers";
import { FieldProps, useFormikContext } from "formik";
import { DateTime } from "luxon";
import { getNested } from "../../util/utilities";

interface FormikDateTimePickerProps
  extends FieldProps,
    Omit<
      DateTimePickerProps<DateTime>,
      "name" | "value" | "onChange" | "renderInput"
    > {}

function FormikDateTimePicker({
  field,
  form,
  ...props
}: FormikDateTimePickerProps) {
  const { setFieldValue, setFieldTouched } = useFormikContext();
  const { name } = field;
  const { touched, errors } = form;
  const fieldError =
    getNested(touched, name) && getNested(errors, name) ? "Error" : "";

  function handleChange(value: DateTime | null) {
    setFieldValue(name, value);
  }
  function handleBlur() {
    setFieldTouched(name, true);
  }

  return (
    <DateTimePicker
      {...field}
      {...props}
      onChange={handleChange}
      slots={{
        textField: TextField,
      }}
      slotProps={{
        actionBar: {
          actions: ["clear", "today", "cancel", "accept"],
        },
        textField: {
          onBlur: handleBlur,
          error: Boolean(fieldError),
          helperText: getNested(errors, name),
          size: "small",
        } as TextFieldProps,
        openPickerButton: {
          onBlur: handleBlur,
        },
      }}
    />
  );
}

export default FormikDateTimePicker;
