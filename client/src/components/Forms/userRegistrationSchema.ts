import * as yup from "yup";

const userRegistrationSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Passwords must be at least 8 characters long")
    .matches(
      /^(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])(?=.*\d)(?=.*[a-zA-Z]).+/,
      "Password must contain at least one number and one special character.",
    ),
  confirmPassword: yup
    .string()
    .required("Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Email is required"),
});

export default userRegistrationSchema;
