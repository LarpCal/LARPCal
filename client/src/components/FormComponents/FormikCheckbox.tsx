import { Checkbox, FormControlLabel } from "@mui/material";
import { FieldProps } from "formik";
import { FC } from "react";

type FormikCheckboxProps = FieldProps & { label: string };

const FormikCheckbox: FC<FormikCheckboxProps> = ({ field, label }) => {
  const { name, value, onChange } = field;
  return (
    <FormControlLabel
      control={<Checkbox />}
      name={name}
      label={label}
      checked={!!value}
      onChange={onChange}
    />
  );
};

export default FormikCheckbox;
