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
    .oneOf([yup.ref("password")], "Passwords must match")
    .when("password", {
      is: (val: unknown) => typeof val === "string" && val.length > 0,
      then: (schema) => schema.required("Please confirm your password"),
    }),
  email: yup
    .string()
    .email("Please provide a valid email")
    .required("Email is required"),
  registered: yup.boolean().default(true),
});

export default userRegistrationSchema;
