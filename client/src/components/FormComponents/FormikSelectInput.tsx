import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FieldProps } from "formik";

type SelectInputProps = FieldProps & {
  options: { label: string; value: string }[];
  label: string;
};

interface test
  extends FieldProps,
    Omit<SelectInputProps, "name" | "value" | "onChange" | "onBlur"> {}

function FormikSelectInput({ form, field, options, label, ...props }: test) {
  return (
    <FormControl {...props}>
      <InputLabel
        sx={{
          minWidth: "max-content",
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`#${field.name}-label`}
        {...field}
        onChange={(event) => form.setFieldValue(field.name, event.target.value)}
        value={field.value}
      >
        {options.map((option) => (
          <MenuItem value={option.value} key={option.label}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default FormikSelectInput;
